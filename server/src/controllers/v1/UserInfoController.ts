import Joi from "joi";
import UserInfoModel from "../../models/UserInfoModel";
import {HttpCode} from "../../types/errorHandler";
import {MyContext} from "../../types/koa";
import Controller from "../Controller";

class UserInfoController extends Controller {
  public async updateUserInfo(ctx: MyContext): Promise<void> {
    type AnswerReqType = {
      firstName: string;
      middleName: string;
      lastName: string;
      dateOfBirth: string;
    };
    const bodySchema = Joi.object({
      firstName: Joi.string().max(32).label('First name'),
      middleName: Joi.string().max(32).label('Middle name'),
      lastName: Joi.string().max(32).label('Last name'),
      dateOfBirth: Joi.string().isoDate().label('Date of birth'),
    });
    const validated = UserInfoController.assert<AnswerReqType>(bodySchema, ctx.request.body);

    await UserInfoModel.upsert({
      userId: ctx.store.userId,
      firstName: validated.firstName,
      middleName: validated.middleName,
      lastName: validated.lastName,
      dateOfBirth: validated.dateOfBirth,
    });

    ctx.status = HttpCode.accepted;
  }
}

export default new UserInfoController;