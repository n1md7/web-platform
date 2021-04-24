import {MyContext} from '../../types/koa';

export default interface UserInterface {
    user: (ctx: MyContext) => Promise<void>,
    users: (ctx: MyContext) => Promise<void>,
    createNewUser: (ctx: MyContext) => Promise<void>,
    authenticateUser: (ctx: MyContext) => Promise<void | typeof ctx.status>,
}