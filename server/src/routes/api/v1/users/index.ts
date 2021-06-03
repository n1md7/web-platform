import Router from "@koa/router";
import UserController, {UserRole} from "../../../../controllers/v1/UserController";
import UserInfoController from "../../../../controllers/v1/UserInfoController";
import allowAccess from "../../../../middlewares/allowAccess";
import authValidator from '../../../../middlewares/authValidator';

const userRouter = new Router();
const superAdminAccess = allowAccess([UserRole.superAdmin]);

userRouter.get('/user/details', authValidator, UserController.getUserDetails);
userRouter.get('/user/status', authValidator, UserController.status);
userRouter.get('/user/token/refresh', authValidator, UserController.refreshToken);
userRouter.get('/user/token/restore/:key', UserController.restoreExpiredToken);

userRouter.put('/user/role', authValidator, superAdminAccess, UserController.updateRoleById);
userRouter.put('/user/status', authValidator, superAdminAccess, UserController.updateStatusById);
userRouter.put('/user/info', authValidator, UserInfoController.updateUserInfo);
userRouter.put('/user/password', authValidator, UserController.updatePassword);
userRouter.put('/user/forget-password/:token', UserController.resetPasswordByResetLink);

userRouter.post('/user/new', UserController.createNewUser);
userRouter.post('/user/auth', UserController.authenticateUser);
userRouter.post('/user/reset', UserController.createResetPasswordLink);

export default userRouter;
