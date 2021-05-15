import Joi from "joi";
import TemplateQuestionModel, {TemplateQuestionStatus} from "../../models/TemplateQuestionModel";
import {HttpCode} from "../../types/errorHandler";
import {MyContext} from "../../types/koa";
import Controller from "../Controller";

export const CreateTemplateGroupSchema = Joi.object({
  text: Joi.string().min(6).max(128).required().label('Template Name Text'),
  groupId: Joi.number().positive().required().label('Group ID'),
});

type TemplateQuestionType = {
  text: string;
  groupId: number
}

class TemplateQuestionController extends Controller {
  /**
   * @summary Creates a new Template Question
   * @param {MyContext} ctx - My Koa context
   * @param {TemplateQuestionType} ctx.request.body - Required request params for the new Template Question
   */
  public async createNewTemplateQuestion(ctx: MyContext): Promise<void> {
    // Throws error when invalid validation is detected
    const validated = TemplateQuestionController.assert<TemplateQuestionType>(CreateTemplateGroupSchema, ctx.request.body);

    ctx.body = await TemplateQuestionModel.create({
      groupId: validated.groupId,
      text: validated.text,
      status: TemplateQuestionStatus.active
    });

    ctx.status = HttpCode.created;
  }
}

export default new TemplateQuestionController;