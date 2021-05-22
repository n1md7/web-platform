import Joi from "joi";
import TemplateQuestionModel, {TemplateQuestionStatus} from "../../models/TemplateQuestionModel";
import {HttpCode} from "../../types/errorHandler";
import {MyContext} from "../../types/koa";
import Controller, {ExposeError} from "../Controller";

export const CreateTemplateGroupSchema = Joi.object({
  text: Joi.string().min(6).max(128).required().label('Template Name Text'),
  groupId: Joi.number().positive().required().label('Group ID'),
});

type TemplateQuestionType = {
  text: string;
  groupId: number
}

const UpdateQuestionSchema = Joi.object({
  text: Joi.string().min(6).max(128).required().label('Question Name Text'),
  status: Joi.string()
    .optional()
    .valid(TemplateQuestionStatus.active, TemplateQuestionStatus.hidden)
    .default(TemplateQuestionStatus.active)
    .label('Template Status'),
});

type QuestionType = {
  text: string,
  status: TemplateQuestionStatus
}

const UpdateQuestionQuerySchema = Joi.object({
  questionId: Joi.number().positive().required().label('Question ID'),
});

type QuestionQueryType = {
  questionId: number
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

  public async getTemplateQuestionById(ctx: MyContext): Promise<void> {
    const validatedParam = TemplateQuestionController.assert<QuestionQueryType>(Joi.object({
      questionId: Joi.number().positive().required().label('Question ID'),
    }), ctx.params);

    ctx.body = await TemplateQuestionModel.findByPk(validatedParam.questionId);
  }

  public async updateTemplateQuestionById(ctx: MyContext): Promise<void> {
    const validatedBody = TemplateQuestionController.assert<QuestionType>(UpdateQuestionSchema, ctx.request.body);
    const validatedParam = TemplateQuestionController.assert<QuestionQueryType>(UpdateQuestionQuerySchema, ctx.params);

    const [updatedRecordCount] = await TemplateQuestionModel.update({
      text: validatedBody.text,
      status: validatedBody.status,
    }, {
      where: {
        id: validatedParam.questionId
      }
    });

    if (updatedRecordCount !== 1) {
      throw new ExposeError(TemplateQuestionController.composeJoyErrorDetails([{
          message: `Record was not updated for the id: ${validatedParam.questionId}`,
          key: 'text',
          value: validatedBody.text
        }])
      );
    }

    ctx.status = HttpCode.noContent;
  }
}

export default new TemplateQuestionController;