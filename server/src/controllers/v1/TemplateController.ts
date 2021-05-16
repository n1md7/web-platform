import Joi from "joi";
import TemplateGroupModel, {TemplateGroupStatus} from "../../models/TemplateGroupModel";
import TemplateModel, {TemplateStatus} from "../../models/TemplateModel";
import TemplateQuestionModel, {TemplateQuestionStatus} from "../../models/TemplateQuestionModel";
import {HttpCode} from "../../types/errorHandler";
import {MyContext} from "../../types/koa";
import Controller, {UserInputValidationError} from "../Controller";

export const CreateTemplateSchema = Joi.object({
  name: Joi.string().min(6).max(128).required().label('Template Name'),
  status: Joi.string()
    .optional()
    .valid(TemplateStatus.active, TemplateStatus.hidden)
    .default(TemplateStatus.active)
    .label('Template Status'),
});

type TemplateType = {
  name: string,
  status: TemplateStatus
}

export const UpdateTemplateQuerySchema = Joi.object({
  templateId: Joi.number().positive().required().label('Template ID'),
});

type TemplateQueryType = {
  templateId: number
}

class TemplateController extends Controller {
  public async createNewTemplate(ctx: MyContext): Promise<void> {
    const validated = TemplateController.assert<TemplateType>(CreateTemplateSchema, ctx.request.body);

    ctx.body = await TemplateModel.create({
      name: validated.name,
      status: validated.status
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

  // Gets only with status:active
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

  public async updateTemplateNameById(ctx: MyContext): Promise<void> {
    const validatedBody = TemplateController.assert<TemplateType>(CreateTemplateSchema, ctx.request.body);
    const validatedParam = TemplateController.assert<TemplateQueryType>(UpdateTemplateQuerySchema, ctx.params);

    const [updatedRecordCount] = await TemplateModel.update({
      name: validatedBody.name,
      status: validatedBody.status,
    }, {
      where: {
        id: validatedParam.templateId
      }
    });

    if (updatedRecordCount !== 1) {
      throw new UserInputValidationError(TemplateController.composeJoyErrorDetails([{
          message: `Record was not updated for the id: ${validatedParam.templateId}`,
          key: 'name',
          value: validatedBody.name
        }])
      );
    }

    ctx.status = HttpCode.noContent;
  }
}

export default new TemplateController;