import Joi from "joi";
import TemplateGroupModel, {TemplateGroupStatus} from "../../models/TemplateGroupModel";
import {HttpCode} from "../../types/errorHandler";
import {MyContext} from "../../types/koa";
import Controller from "../Controller";

export const CreateTemplateGroupSchema = Joi.object({
  text: Joi.string().min(6).max(128).required().label('Template Name Text'),
  templateId: Joi.number().positive().required().label('Template ID'),
});

type TemplateGroupType = {
  text: string;
  templateId: number
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
}

export default new TemplateGroupController;