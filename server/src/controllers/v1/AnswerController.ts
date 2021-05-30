import Joi from "joi";
import AnswerModel, {AnswerStatus} from "../../models/AnswerModel";
import {HttpCode} from "../../types/errorHandler";
import {MyContext} from "../../types/koa";
import Controller from "../Controller";

class AnswerController extends Controller {
  public async createNewAnswer(ctx: MyContext): Promise<void> {
    type AnswerReqType = {
      questionId: number;
      text: string
    };
    const bodySchema = Joi.object({
      questionId: Joi.number().positive().label('Question ID'),
      text: Joi.string().label('Question text'),
    });
    const validated = AnswerController.assert<AnswerReqType>(bodySchema, ctx.request.body);

    await AnswerModel.create({
      userId: ctx.store.userId,
      questionId: validated.questionId,
      text: validated.text,
      status: AnswerStatus.active
    });

    ctx.status = HttpCode.created;
  }
}

export default new AnswerController;