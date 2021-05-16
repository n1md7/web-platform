import StringUtils from "../helpers/StringUtils";
import UserModel from "../models/UserModel";
import {RequestAuthType, UserType} from "../types/user";

export default class UserService {
  /**
   * @summary Accepts {RequestAuthType} and validates user credentials
   * @param requestParam
   * @returns null or user object
   */
  public static async credentialsAreValid(requestParam: RequestAuthType): Promise<null | UserType> {
    const user = await UserModel.findOne({
      where: {
        email: requestParam.email,
      }
    });
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
}
