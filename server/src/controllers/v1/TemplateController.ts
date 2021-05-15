import Joi from "joi";
import TemplateGroupModel, {TemplateGroupStatus} from "../../models/TemplateGroupModel";
import TemplateModel, {TemplateStatus} from "../../models/TemplateModel";
import TemplateQuestionModel, {TemplateQuestionStatus} from "../../models/TemplateQuestionModel";
import {HttpCode} from "../../types/errorHandler";
import {MyContext} from "../../types/koa";
import Controller from "../Controller";

export const CreateTemplateSchema = Joi.object({
  name: Joi.string().min(6).max(128).required().label('Template Name'),
});

type TemplateType = {
  name: string
}

class TemplateController extends Controller {
  public async createNewTemplate(ctx: MyContext): Promise<void> {
    const validated = TemplateController.assert<TemplateType>(CreateTemplateSchema, ctx.request.body);

    ctx.body = await TemplateModel.create({
      name: validated.name,
      status: TemplateStatus.active
    });

    ctx.status = HttpCode.created;
  }

  public async getTemplateList(ctx: MyContext): Promise<void> {
    ctx.body = await TemplateModel.findAll({
      where: {
        status: TemplateStatus.active
      }
    });
  }

  public async getTemplateDetails(ctx: MyContext): Promise<void> {
    ctx.body = await TemplateModel.findAll({
      where: {
        status: TemplateStatus.active,
      },
      attributes: ['id', 'name'],
      include: {
        model: TemplateGroupModel,
        attributes: ['id', 'templateId', 'text'],
        where: {
          status: TemplateGroupStatus.active
        },
        include: [{
          model: TemplateQuestionModel,
          attributes: ['id', 'groupId', 'text'],
          where: {
            status: TemplateQuestionStatus.active
          },
        }]
      }
    });
  }
}

export default new TemplateController;