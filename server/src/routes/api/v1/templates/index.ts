import Router from "@koa/router";
import TemplateController from "../../../../controllers/v1/TemplateController";
import TemplateGroupController from "../../../../controllers/v1/TemplateGroupController";
import authValidator from '../../../../middlewares/authValidator';

const templateRouter = new Router();

templateRouter.get('/templates', authValidator, TemplateController.getTemplateList);
templateRouter.get('/template/groups', authValidator, TemplateGroupController.getTemplateGroupList);

templateRouter.post('/template/new', authValidator, TemplateController.createNewTemplate);
templateRouter.post('/template/group/new', authValidator, TemplateGroupController.createNewTemplateGroup);

export default templateRouter;
