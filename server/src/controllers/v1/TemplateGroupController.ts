import Joi from "joi";
import TemplateGroupModel, {TemplateGroupStatus} from "../../models/TemplateGroupModel";
import {HttpCode} from "../../types/errorHandler";
import {MyContext} from "../../types/koa";
import Controller, {ExposeError} from "../Controller";

export const CreateTemplateGroupSchema = Joi.object({
  text: Joi.string().min(6).max(128).required().label('Template Name Text'),
  templateId: Joi.number().positive().required().label('Template ID'),
});

type TemplateGroupType = {
  text: string;
  templateId: number
}

const UpdateGroupSchema = Joi.object({
  text: Joi.string().min(6).max(128).required().label('Group Name Text'),
  status: Joi.string()
    .optional()
    .valid(TemplateGroupStatus.active, TemplateGroupStatus.hidden)
    .default(TemplateGroupStatus.active)
    .label('Template Status'),
});

type GroupType = {
  text: string,
  status: TemplateGroupStatus
}

const UpdateGroupQuerySchema = Joi.object({
  groupId: Joi.number().positive().required().label('Group ID'),
});

type GroupQueryType = {
  groupId: number
}

class TemplateGroupController extends Controller {
  /**
   * @summary Creates a new Template Group
   * @param {MyContext} ctx - My Koa context
   * @param {TemplateGroupType} ctx.request.body - Required request params for the new Template Group
   */
  public async createNewTemplateGroup(ctx: MyContext): Promise<void> {
    // Throws error when invalid validation is detected
    const validated = TemplateGroupController.assert<TemplateGroupType>(CreateTemplateGroupSchema, ctx.request.body);

    ctx.body = await TemplateGroupModel.create({
      templateId: validated.templateId,
      text: validated.text,
      status: TemplateGroupStatus.active
    });

    ctx.status = HttpCode.created;
  }

  public async getTemplateGroupList(ctx: MyContext): Promise<void> {
    ctx.body = await TemplateGroupModel.findAll({
      where: {
        status: TemplateGroupStatus.active
      }
    });
  }

  public async getTemplateGroupById(ctx: MyContext): Promise<void> {
    const validatedParam = TemplateGroupController.assert<GroupQueryType>(Joi.object({
      groupId: Joi.number().positive().required().label('Group ID'),
    }), ctx.params);

    ctx.body = await TemplateGroupModel.findByPk(validatedParam.groupId);
  }

  public async updateTemplateGroupById(ctx: MyContext): Promise<void> {
    const validatedBody = TemplateGroupController.assert<GroupType>(UpdateGroupSchema, ctx.request.body);
    const validatedParam = TemplateGroupController.assert<GroupQueryType>(UpdateGroupQuerySchema, ctx.params);

    const [updatedRecordCount] = await TemplateGroupModel.update({
      text: validatedBody.text,
      status: validatedBody.status,
    }, {
      where: {
        id: validatedParam.groupId
      }
    });

    if (updatedRecordCount !== 1) {
      throw new ExposeError(TemplateGroupController.composeJoyErrorDetails([{
          message: `Record was not updated for the id: ${validatedParam.groupId}`,
          key: 'text',
          value: validatedBody.text
        }])
      );
    }

    ctx.status = HttpCode.noContent;
  }
}

export default new TemplateGroupController;