import Router from '@koa/router';
import userRouter from './users';
import templateRouter from './templates';

const apiRoute = new Router();
const combineApiRoutes = [
  userRouter.routes(),
  templateRouter.routes(),
];
apiRoute.use('/v1', ...combineApiRoutes);

export default apiRoute;
