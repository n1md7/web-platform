import Router from "@koa/router";
import AnswerController from "../../../../controllers/v1/AnswerController";
import AssessmentController from "../../../../controllers/v1/AssessmentController";
import authValidator from '../../../../middlewares/authValidator';

const assessmentRouter = new Router();

assessmentRouter.get('/assessments', authValidator, AssessmentController.getAssessmentList);
assessmentRouter.get('/assessment/details', authValidator, AssessmentController.getAssessmentDetails);
assessmentRouter.get('/assessment/details/:assessmentId', authValidator, AssessmentController.getAssessmentDetailsById);

assessmentRouter.post('/assessment/new', authValidator, AssessmentController.create);
assessmentRouter.post('/assessment/answer', authValidator, AnswerController.createNewAnswer);

export default assessmentRouter;
