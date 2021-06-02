import Joi from 'joi';
import {Context} from 'koa';
import NodeCache from 'node-cache';
import StringUtils from "../../helpers/StringUtils";
import CountryModel from "../../models/CountryModel";
import IndustryModel from "../../models/IndustryModel";
import OrganisationModel from "../../models/OrganisationModel";
import ResetPasswordTokenModel, {ResetPasswordTokenType, ResetTokenStatus} from "../../models/ResetPasswordTokenModel";
import UserInfoModel from "../../models/UserInfoModel";
import UserModel, {UserPlan, UserType} from "../../models/UserModel";
import MailService from "../../services/MailService";
import UserService from "../../services/UserService";
import {HttpCode} from '../../types/errorHandler';
import {MyContext} from '../../types/koa';
import Controller, {ExposeError} from "../Controller";

enum CacheInterval {
  day = 60 * 60 * 12 * 24,
  week = CacheInterval.day * 7
}

const rememberMeTokens = new NodeCache({
  stdTTL: CacheInterval.week,
  checkperiod: CacheInterval.day
});

export enum UserRole {
  user = 'user',
  supplier = 'supplier',
  admin = 'admin',
  bot = 'bot'
}

export enum UserStatus {
  active = 'active',
  disabled = 'disabled',
  blocked = 'blocked'
}

export type JwtPayload = {
  role: UserRole;
  email: string;
  userId: number;
  iat?: number;
  exp?: number;
};

export const CreateUserSchema = Joi.object({
  email: Joi.string().min(6).max(128).required().label('E-mail'),
  role: Joi.string().valid(UserRole.user, UserRole.supplier).required().label('Role'),
  password: Joi.string().min(8).max(128).required().label('Password'),
  confirmPassword: Joi.string().min(8).max(128).required().label('Confirm Password'),
});

export const AuthUserSchema = Joi.object({
  email: Joi.string().min(6).max(128).required().label('E-mail'),
  password: Joi.string().min(8).max(128).required().label('Password'),
  rememberMe: Joi.boolean().optional().default(false).label('Remember me'),
});

export const ChangePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(8).max(128).required().label('Current Password'),
  newPassword: Joi.string().min(8).max(128).required().label('New Password'),
  confirmPassword: Joi.string().min(8).max(128).required().label('Confirm Password'),
});

type CreateUserSchemaType = {
  email: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
}

export type AuthUserSchemaType = {
  email: string;
  password: string;
  rememberMe: boolean;
}

type ChangePasswordSchemaType = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class UserController extends Controller {
  // Provide user JWT expiration status
  public async status(ctx: MyContext): Promise<void> {
    const currentTimeSec = Math.ceil(new Date().valueOf() / 1000);
    // Expires in [seconds] return as response body
    ctx.body = ctx.store.exp - currentTimeSec;
  }

  public async refreshToken(ctx: MyContext): Promise<void> {
    ctx.body = UserController.generateNewJWT({
      userId: ctx.store.userId,
      role: ctx.store.role,
      email: ctx.store.email
    });
  }

  /**
   * @summary User registration
   * @param {object} ctx - Koa context
   * @param {object} ctx.request - Koa request
   * @param {object} ctx.params.body - Koa request body
   * @param {string} ctx.params.body.email - email value
   * @param {string} ctx.params.body.role - user role value
   * @param {string} ctx.params.body.password - password value
   * @param {string} ctx.params.body.confirmPassword - confirmation password value
   * @returns void
   */
  public async createNewUser(ctx: Context): Promise<void> {
    const validated = UserController.assert<CreateUserSchemaType>(CreateUserSchema, ctx.request.body);

    if (validated.password !== validated.confirmPassword) {
      throw new ExposeError(UserController.composeJoyErrorDetails([{
          message: "Passwords didn't match!",
          key: 'password',
          value: validated.password
        }, {
          message: "Passwords didn't match!",
          key: 'confirmPassword',
          value: validated.confirmPassword
        }])
      );
    }

    const resultRow = await UserModel.findOne({
      where: {
        email: validated.email
      }
    });

    if (resultRow) {
      throw new ExposeError(UserController.composeJoyErrorDetails([{
          message: "E-mail address is already taken",
          key: 'email',
          value: validated.email
        }])
      );
    }

    const passwordHash = await StringUtils.hashPassword(validated.password);

    await UserModel.create({
      email: validated.email,
      password: passwordHash,
      role: UserRole.user,
      status: UserStatus.active,
      plan: UserPlan.free
    });

    ctx.status = HttpCode.created;
  }

  /**
   * @summary Authenticates user - public route
   * @param {object} ctx - Koa context
   * @param {object} ctx.request - Koa request
   * @param {object} ctx.params.body - Koa request body
   * @param {string} ctx.params.body.email - email value
   * @param {string} ctx.params.body.password - password value
   * @param {boolean} ctx.params.body.rememberMe - rememberMe state
   * @returns void
   */
  public async authenticateUser(ctx: Context): Promise<void> {
    const validated = UserController.assert<AuthUserSchemaType>(AuthUserSchema, ctx.request.body);

    const user: UserType = await UserService.credentialsAreValid(validated);
    if (!user) {
      throw new ExposeError(UserController.composeJoyErrorDetails([]), {
          exceptionMessage: 'Incorrect credentials',
          status: HttpCode.unauthorized
        }
      );
    }
    const refreshToken = validated.rememberMe ? UserController.generateRefreshTokenString() : '';
    const payload = {
      userId: user.id,
      role: user.role,
      email: user.email
    };
    // Generate JsonWebToke for authentication
    const jwtToken = UserController.generateNewJWT(payload);
    if (refreshToken) {
      rememberMeTokens.set(refreshToken, payload);
    }

    ctx.body = {
      refreshToken,
      jwt: jwtToken
    };
  }

  /**
   * Restores expired token from cache with refreshToken value - public route
   * @param {object} ctx - koa context
   * @param {object} ctx.params - koa request GET params
   * @param {string} ctx.params.key - koa request GET param [key]
   */
  public async restoreExpiredToken(ctx: Context): Promise<void> {
    const schema = Joi.object({
      key: Joi.string().required().label('Refresh token key value'),
    });
    const validated = UserController.assert<{ key: string }>(schema, ctx.params);

    if (!rememberMeTokens.has(validated.key)) {
      throw new ExposeError(UserController.composeJoyErrorDetails([{
          message: 'Invalid refresh token',
          key: 'key',
          value: validated.key
        }]), {
          status: HttpCode.badRequest
        }
      );
    }

    const restoredUser: JwtPayload = rememberMeTokens.get(validated.key);
    // remove from cache
    rememberMeTokens.del(validated.key);
    // create new refresh token and save into cache
    const newRefreshToken = UserController.generateRefreshTokenString();
    rememberMeTokens.set(newRefreshToken, restoredUser);
    // Generate JsonWebToke for authentication
    ctx.body = {
      jwt: UserController.generateNewJWT({
        userId: restoredUser.userId,
        role: restoredUser.role,
        email: restoredUser.email
      }),
      refreshToken: newRefreshToken
    };
  }

  public async getUserDetails(ctx: MyContext): Promise<void> {
    ctx.body = await UserModel.findByPk(ctx.store.userId, {
      attributes: ['id', 'email', 'role'],
      include: {
        model: UserInfoModel,
        include: [{
          model: OrganisationModel,
          include: [IndustryModel, CountryModel]
        }]
      }
    });
  }

  public async updatePassword(ctx: MyContext): Promise<void> {
    const validated: ChangePasswordSchemaType = UserController.assert(ChangePasswordSchema, ctx.request.body);
    const user = await UserModel.findByPk(ctx.store.userId);

    if (!await StringUtils.hashCompare(validated.currentPassword, user.password)) {
      throw new ExposeError(UserController.composeJoyErrorDetails([{
          message: "Current password is incorrect",
          key: 'currentPassword',
          value: validated.currentPassword
        }])
      );
    }

    if (validated.newPassword !== validated.confirmPassword) {
      throw new ExposeError(UserController.composeJoyErrorDetails([{
          message: null,
          key: 'newPassword',
          value: validated.newPassword
        }, {
          message: null,
          key: 'confirmPassword',
          value: validated.confirmPassword
        }]), {
          exceptionMessage: "New password field values did not match"
        }
      );
    }

    const newPasswordHash = await StringUtils.hashPassword(validated.newPassword);
    await UserModel.update({password: newPasswordHash}, {
      where: {
        id: user.id
      }
    });

    ctx.status = HttpCode.accepted;
  }

  public async createResetPasswordLink(ctx: Context): Promise<void> {
    const validated = UserController.assert<{ email: string }>(Joi.object({
      email: Joi.string().min(5).max(128).required().label('E-mail address'),
    }), ctx.request.body);

    const activeUser = await UserModel.findOne({
      where: {
        email: validated.email,
        status: UserStatus.active
      }
    });
    if (!activeUser) {
      throw new ExposeError(UserController.composeJoyErrorDetails([{
          message: "No user associated with this E-mail address",
          key: 'email',
          value: validated.email
        }])
      );
    }

    const existingResetToken = await ResetPasswordTokenModel.findOne({
      where: {
        email: validated.email,
        status: ResetTokenStatus.active
      }
    });

    if (existingResetToken) {
      // Invalidate it first
      await ResetPasswordTokenModel.update({status: ResetTokenStatus.invalidated}, {
        where: {
          email: validated.email,
          status: ResetTokenStatus.active
        }
      });
    }

    const hash = StringUtils.randomChars(64);
    // Insert new token
    await ResetPasswordTokenModel.create({
      email: validated.email,
      token: hash,
      status: ResetTokenStatus.active
    });

    const resetEndpoint = process.env.API_ENDPOINT || `http://localhost:3000`;
    // Send email
    await MailService.send({
      to: validated.email,
      subject: 'Password reset link',
      text: `Here is the link to reset password: ${resetEndpoint}/password/reset/${hash}`,
      html: `<h3>Here is the link to reset password: ${resetEndpoint}/password/reset/${hash}</h3>`
    });

    ctx.status = HttpCode.accepted;
  }

  public async resetPasswordByResetLink(ctx: Context): Promise<void> {
    const validatedParams = UserController.assert<{ token: string }>(Joi.object({
      token: Joi.string().length(64).required().label('Password reset token'),
    }), ctx.params);
    const validatedBody: {
      newPassword: string;
      confirmPassword: string;
    } = UserController.assert(Joi.object({
      newPassword: Joi.string().min(8).max(128).required().label('New Password'),
      confirmPassword: Joi.string().min(8).max(128).required().label('Confirm Password'),
    }), ctx.request.body);

    const resetTokenExist: ResetPasswordTokenType = await ResetPasswordTokenModel.findOne({
      where: {
        token: validatedParams.token,
        status: ResetTokenStatus.active
      }
    });

    if (!resetTokenExist) {
      throw new ExposeError(UserController.composeJoyErrorDetails([{
          message: "Reset token is invalid or it doesn't exist",
          key: 'token',
          value: validatedParams.token
        }])
      );
    }

    if (validatedBody.newPassword !== validatedBody.confirmPassword) {
      throw new ExposeError(UserController.composeJoyErrorDetails([{
          message: null,
          key: 'newPassword',
          value: validatedBody.newPassword
        }, {
          message: null,
          key: 'confirmPassword',
          value: validatedBody.confirmPassword
        }]), {
          exceptionMessage: "New password field values did not match"
        }
      );
    }

    const newPasswordHash = await StringUtils.hashPassword(validatedBody.newPassword);
    // Update password value
    await UserModel.update({password: newPasswordHash}, {
      where: {
        email: resetTokenExist.email
      }
    });
    // Mark token as used
    await ResetPasswordTokenModel.update({status: ResetTokenStatus.used}, {
      where: {
        email: resetTokenExist.email,
        status: ResetTokenStatus.active
      }
    });

    ctx.status = HttpCode.accepted;
  }
}

export default new UserController;
