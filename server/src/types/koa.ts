import {Context} from 'koa';
import {JwtPayload} from '../controllers/v1/UserController';

export interface MyContext extends Context {
  store: JwtPayload
}
