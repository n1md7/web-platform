import Router from "@koa/router";
import TemplateController from "../../../../controllers/v1/TemplateController";
import authValidator from '../../../../middlewares/authValidator';

const templateRouter = new Router();

templateRouter.get('/templates', authValidator, TemplateController.getTemplateList);
templateRouter.post('/template/new', authValidator, TemplateController.createNewTemplate);

export default templateRouter;
