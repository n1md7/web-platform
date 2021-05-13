import Joi from 'joi';
import JsonWebToken from 'jsonwebtoken';
import {Context} from 'koa';
import NodeCache from 'node-cache';
import StringUtils from "../../helpers/StringUtils";
import UserModel from "../../models/UserModel";
import UserService from "../../services/UserService";
import {HttpCode} from '../../types/errorHandler';
import {MyContext} from '../../types/koa';
import {RequestUserType, UserRole, UserStatus, UserType} from "../../types/user";
import {authUserSchema, createUserSchema} from './validators/UserRequestValidator';

enum CacheInterval {
  day = 60 * 60 * 12 * 24,
  week = CacheInterval.day * 7
}

const rememberMeTokens = new NodeCache({
  stdTTL: CacheInterval.week,
  checkperiod: CacheInterval.day
});

export type JwtPayload = {
  role: UserRole;
  email: string;
  userId: number;
  iat?: number;
  exp?: number;
};

class UserController {
  private static generateNewJWT(payload: JwtPayload): string {

    return JsonWebToken.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
  }

  private static generateRefreshTokenString(): string {
    return StringUtils.randomChars(128);
  }

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
    const validation = createUserSchema.validate(ctx.request.body);
    if (validation.error as Joi.ValidationError) {
      ctx.throw(HttpCode.badRequest, validation.error.details.pop().message);
    }
    if (validation.value.password !== validation.value.confirmPassword) {
      ctx.throw(HttpCode.badRequest, "'password' and 'confirmPassword' didn't match!");
    }

    const requestParam = validation.value as RequestUserType;
    const resultRow = await UserModel.findOne({
      where: {
        email: requestParam.email
      }
    });

    if (resultRow) {
      ctx.throw(HttpCode.badRequest, `Such username/email already taken`);
    }

    const passwordHash = await StringUtils.hashPassword(requestParam.password);

    await UserModel.create({
      email: requestParam.email,
      password: passwordHash,
      role: UserRole.basic,
      status: UserStatus.active
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
  public async authenticateUser(ctx: Context): Promise<void | typeof ctx.status> {
    const validation = authUserSchema.validate(ctx.request.body);
    if (validation.error as Joi.ValidationError) {
      ctx.throw(HttpCode.badRequest, validation.error.details.pop().message);
    }
    const user = await UserService.credentialsAreValid(validation.value) as UserType;
    if (!user) {
      return ctx.status = HttpCode.unauthorized;
    }
    const refreshToken = validation.value?.rememberMe ? UserController.generateRefreshTokenString() : '';
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
  public async restoreExpiredToken(ctx: Context): Promise<void | number> {
    const token: string = ctx.params.key;
    if (!rememberMeTokens.has(token)) {
      return ctx.status = 400;
    }

    const restoredUser = rememberMeTokens.get(token) as JwtPayload;
    // remove from cache
    rememberMeTokens.del(token);
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
}

export default new UserController;
