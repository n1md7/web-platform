import Router from "@koa/router";
import AssessmentController from "../../../../controllers/v1/AssessmentController";
import authValidator from '../../../../middlewares/authValidator';

const assessmentRouter = new Router();

// ToDo: Document these endpoints in Swagger API
assessmentRouter.get('/assessments', authValidator, AssessmentController.getAssessmentList);
assessmentRouter.get('/assessment/details', authValidator, AssessmentController.getAssessmentDetails);

assessmentRouter.post('/assessment/new', authValidator, AssessmentController.createNewTemplate);

export default assessmentRouter;
