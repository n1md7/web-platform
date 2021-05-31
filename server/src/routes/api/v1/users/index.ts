import Router from "@koa/router";
import UserController from "../../../../controllers/v1/UserController";
import UserInfoController from "../../../../controllers/v1/UserInfoController";
import authValidator from '../../../../middlewares/authValidator';

const userRouter = new Router();

userRouter.get('/user/details', authValidator, UserController.getUserDetails);
userRouter.get('/user/status', authValidator, UserController.status);
userRouter.get('/user/token/refresh', authValidator, UserController.refreshToken);
userRouter.get('/user/token/restore/:key', UserController.restoreExpiredToken);

userRouter.put('/user/info', authValidator, UserInfoController.updateUserInfo);
userRouter.put('/user/password', authValidator, UserController.updatePassword);

userRouter.post('/user/new', UserController.createNewUser);
userRouter.post('/user/auth', UserController.authenticateUser);

export default userRouter;
