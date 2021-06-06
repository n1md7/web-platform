import Router from '@koa/router';
import assessmentRouter from './assessments';
import downloadRouter from './downloads';
import organisationRouter from './organisation';
import templateRouter from './templates';
import uploadRouter from './uploads';
import userRouter from './users';

const apiRoute = new Router();
const combineApiRoutes = [
  userRouter.routes(),
  templateRouter.routes(),
  assessmentRouter.routes(),
  uploadRouter.routes(),
  downloadRouter.routes(),
  organisationRouter.routes(),
];
apiRoute.use('/v1', ...combineApiRoutes);

export default apiRoute;
