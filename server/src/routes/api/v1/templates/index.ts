import Router from "@koa/router";
import TemplateController from "../../../../controllers/v1/TemplateController";
import TemplateGroupController from "../../../../controllers/v1/TemplateGroupController";
import TemplateQuestionController from "../../../../controllers/v1/TemplateQuestionController";
import authValidator from '../../../../middlewares/authValidator';

const templateRouter = new Router();

templateRouter.get('/template/details', authValidator, TemplateController.getTemplateDetails);
templateRouter.get('/templates', authValidator, TemplateController.getTemplateList);
templateRouter.get('/template/groups', authValidator, TemplateGroupController.getTemplateGroupList);
templateRouter.get('/template/group/question/:questionId', authValidator, TemplateQuestionController.getTemplateQuestionById);
templateRouter.get('/template/group/:groupId', authValidator, TemplateGroupController.getTemplateGroupById);
templateRouter.get('/template/detail/:templateId', authValidator, TemplateController.getTemplateDetailById);
// Do not move this up. /template/:templateId will match all in /template/[any] route so should be the last one
templateRouter.get('/template/:templateId', authValidator, TemplateController.getTemplateById);

templateRouter.put('/template/group/question/:questionId', authValidator, TemplateQuestionController.updateTemplateQuestionById);
templateRouter.put('/template/group/:groupId', authValidator, TemplateGroupController.updateTemplateGroupById);
templateRouter.put('/template/:templateId', authValidator, TemplateController.updateTemplateById);

templateRouter.post('/template/new', authValidator, TemplateController.createNewTemplate);
templateRouter.post('/template/group/new', authValidator, TemplateGroupController.createNewTemplateGroup);
templateRouter.post('/template/group/question/new', authValidator, TemplateQuestionController.createNewTemplateQuestion);

export default templateRouter;
