import {Next} from 'koa';
import Controller from "../controllers/Controller";
import {UserRole} from '../controllers/v1/UserController';
import {MyContext} from "../types/koa";

type AllowAccess = {
  (ctx: MyContext, next: Next): Promise<void>
};

export default function (rolesAllowed: UserRole[]): AllowAccess {
  return async (ctx, next) => {
    // When invalid current role => it will throw and error
    Controller.allowed(rolesAllowed).currentRole(ctx.store.role);
    await next();
  }
}

