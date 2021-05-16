import Router from "@koa/router";
import TemplateController from "../../../../controllers/v1/TemplateController";
import TemplateGroupController from "../../../../controllers/v1/TemplateGroupController";
import TemplateQuestionController from "../../../../controllers/v1/TemplateQuestionController";
import authValidator from '../../../../middlewares/authValidator';

const templateRouter = new Router();

templateRouter.get('/templates', authValidator, TemplateController.getTemplateList);
templateRouter.get('/template/details', authValidator, TemplateController.getTemplateDetails);
templateRouter.get('/template/groups', authValidator, TemplateGroupController.getTemplateGroupList);

templateRouter.put('/template/:templateId', authValidator, TemplateController.updateTemplateById);
templateRouter.put('/template/group/:groupId', authValidator, TemplateGroupController.updateTemplateGroupById);

templateRouter.post('/template/new', authValidator, TemplateController.createNewTemplate);
templateRouter.post('/template/group/new', authValidator, TemplateGroupController.createNewTemplateGroup);
templateRouter.post('/template/group/question/new', authValidator, TemplateQuestionController.createNewTemplateQuestion);

export default templateRouter;
