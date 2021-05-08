import {Model} from "sequelize-typescript";
import StringUtils from "../helpers/StringUtils";
import UserModel from "../models/UserModel";
import {RequestAuthType, UserType} from "../types/user";

export default class UserService {
  public static async credentialsAreValid(requestParam: RequestAuthType): Promise<boolean | UserType> {
    const resultRow = await UserModel.findOne({
      where: {
        email: requestParam.email,
      }
    });
    // No such user record in the Database
    if (!resultRow) {
      return false;
    }

    console.log(resultRow);
    console.log(Object.keys(resultRow))
    console.log(resultRow.getDataValue('results') as UserType)
    // const user = resultRow.dataValues as UserType;
    // const hash = user.password;
    // const isValid = await StringUtils.hashCompare(requestParam.password, hash);
    //
    // if (!isValid) {
    //   return false;
    // }
    //
    // return user;
  }
}