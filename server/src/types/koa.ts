import {Context} from 'koa';
import {JwtPayload} from '../controllers/v1/UserController';
import {UserInfoType} from "../models/UserInfoModel";
import {UserType} from "../models/UserModel";

export interface MyContext extends Context {
  store: JwtPayload,
  user: UserType & {
    userInfo?: UserInfoType
  }
}
