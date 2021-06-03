import {Op} from "sequelize";
import Controller, {ExposeError} from "../controllers/Controller";
import {AuthUserSchemaType, UserRole, UserStatus} from "../controllers/v1/UserController";
import StringUtils from "../helpers/StringUtils";
import UserModel, {UserCreateType, UserType} from "../models/UserModel";

export default class UserService {
  /**
   * @summary Accepts {RequestAuthType} and validates user credentials
   * @param requestParam
   * @returns null or user object
   */
  public static async credentialsAreValid(requestParam: AuthUserSchemaType): Promise<null | UserType> {
    const user = await UserModel.findOne({
      where: {
        email: requestParam.email,
      }
    }) as UserType;
    // No such user record in the Database
    if (!user) {
      return null;
    }

    const hash = user.password;
    const isValid = await StringUtils.hashCompare(requestParam.password, hash);

    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      password: user.password,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    } as UserType;
  }

  /**
   * @summary Updates any role - except superAdmin
   * @param id {number}
   * @param role {UserRole}
   * @returns Boolean
   */
  public static async updateRoleById(id: number, role: UserRole): Promise<boolean> {
    const [updateCount] = await UserModel.update({role}, {
      where: {
        id,
        role: {
          [Op.not]: UserRole.superAdmin
        }
      }
    });

    return Boolean(updateCount);
  }

  /**
   * @summary Updates any user status - except for superAdmin
   * @param id {number}
   * @param status {UserRole}
   * @returns Boolean
   */
  public static async updateStatusById(id: number, status: UserStatus): Promise<boolean> {
    const [updateCount] = await UserModel.update({status}, {
      where: {
        id,
        role: {
          [Op.not]: UserRole.superAdmin
        }
      }
    });

    return Boolean(updateCount);
  }

  /**
   * @summary - Creates a new user. Validates by E-mail whether or not its unique
   * @param user {UserCreateType}
   * @throws Error
   * @returns UserType
   */
  public static async createNewUser(user: UserCreateType): Promise<UserType> {
    const userInDb = await UserModel.findOne({
      where: {
        email: user.email
      }
    });

    if (userInDb) {
      throw new ExposeError(Controller.composeJoyErrorDetails([{
          message: "E-mail address is already taken",
          key: 'email',
          value: user.email
        }])
      );
    }

    return UserModel.create(user);
  }
}
