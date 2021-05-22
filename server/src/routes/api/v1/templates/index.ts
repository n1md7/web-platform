import Router from "@koa/router";
import TemplateController from "../../../../controllers/v1/TemplateController";
import TemplateGroupController from "../../../../controllers/v1/TemplateGroupController";
import TemplateQuestionController from "../../../../controllers/v1/TemplateQuestionController";
import {UserRole} from "../../../../controllers/v1/UserController";
import allowAccess from "../../../../middlewares/allowAccess";
import authValidator from '../../../../middlewares/authValidator';

const templateRouter = new Router();
// Make sure this method is used right after authValidator since it is using ctx.store.role value
const adminAccess = allowAccess([UserRole.admin, UserRole.bot]);

// Accessible for all auth users
templateRouter.get('/templates', authValidator, TemplateController.getTemplateList);
// Only admin, bot access below
templateRouter.get('/template/details', authValidator, adminAccess, TemplateController.getTemplateDetails);
templateRouter.get('/template/groups', authValidator, adminAccess, TemplateGroupController.getTemplateGroupList);
templateRouter.get('/template/group/question/:questionId', authValidator, adminAccess, TemplateQuestionController.getTemplateQuestionById);
templateRouter.get('/template/group/:groupId', authValidator, adminAccess, TemplateGroupController.getTemplateGroupById);
templateRouter.get('/template/detail/:templateId', authValidator, adminAccess, TemplateController.getTemplateDetailById);
// Do not move this up. /template/:templateId will match all in /template/[any] route so should be the last one
templateRouter.get('/template/:templateId', authValidator, adminAccess, TemplateController.getTemplateById);

templateRouter.put('/template/group/question/:questionId', authValidator, adminAccess, TemplateQuestionController.updateTemplateQuestionById);
templateRouter.put('/template/group/:groupId', authValidator, adminAccess, TemplateGroupController.updateTemplateGroupById);
templateRouter.put('/template/:templateId', authValidator, adminAccess, TemplateController.updateTemplateById);

templateRouter.post('/template/new', authValidator, adminAccess, TemplateController.createNewTemplate);
templateRouter.post('/template/group/new', authValidator, adminAccess, TemplateGroupController.createNewTemplateGroup);
templateRouter.post('/template/group/question/new', authValidator, adminAccess, TemplateQuestionController.createNewTemplateQuestion);

export default templateRouter;
