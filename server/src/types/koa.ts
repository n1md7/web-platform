import {JwtPayload} from '../controllers/v1/UserController';
import {Context} from 'koa';

export type MyContext = {
    store: JwtPayload
} & Context;
