import Router from "@koa/router";
import UserController from "../../../../controllers/v1/UserController";
import authValidator from '../../../../middlewares/authValidator';

const userRouter = new Router();

userRouter.get('/users', authValidator, UserController.users);
userRouter.get('/user', authValidator, UserController.user);
userRouter.get('/user/status', authValidator, UserController.status);
userRouter.get('/user/token/refresh', authValidator, UserController.refreshToken);
userRouter.get('/user/token/restore/:key', UserController.restoreExpiredToken);
userRouter.post('/user/new', UserController.createNewUser);
userRouter.post('/user/auth', UserController.authenticateUser);

export default userRouter;
