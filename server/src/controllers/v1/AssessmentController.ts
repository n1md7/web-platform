import Joi from "joi";
import AssessmentModel from "../../models/AssessmentModel";
import FileModel, {FileStatus} from "../../models/FileModel";
import GroupModel from "../../models/GroupModel";
import QuestionModel from "../../models/QuestionModel";
import {TemplateGroupStatus} from "../../models/TemplateGroupModel";
import {TemplateStatus} from "../../models/TemplateModel";
import {TemplateQuestionStatus} from "../../models/TemplateQuestionModel";
import TemplateService from "../../services/TemplateService";
import {HttpCode} from "../../types/errorHandler";
import {MyContext} from "../../types/koa";
import Controller from "../Controller";

export const CreateAssessmentSchema = Joi.object({
  templateId: Joi.number().positive().required().label('Template Id'),
});

type AssessmentType = {
  templateId: number
}

class AssessmentController extends Controller {
  public async createNewTemplate(ctx: MyContext): Promise<void> {
    const validated = AssessmentController.assert<AssessmentType>(CreateAssessmentSchema, ctx.request.body);

    const template = await TemplateService.getTemplateDetailsById(validated.templateId);
    // Create assessment
    const assessment = await AssessmentModel.create({
      userId: ctx.store.userId,
      templateId: template.id,
      name: template.name,
      status: TemplateStatus.active
    });
    // Create groups
    for await (const group of template.groups) {
      const newGroup = await GroupModel.create({
        assessmentId: assessment.id,
        text: group.text,
        status: TemplateGroupStatus.active
      });
      // Create questions
      for await (const question of group.questions) {
        await QuestionModel.create({
          groupId: newGroup.id,
          text: question.text,
          status: TemplateQuestionStatus.active
        });
      }
    }

    ctx.status = HttpCode.created;
  }

  public async getAssessmentList(ctx: MyContext): Promise<void> {
    ctx.body = await AssessmentModel.findAll({
      where: {
        status: TemplateStatus.active
      }
    });
  }

  public async getAssessmentDetails(ctx: MyContext): Promise<void> {
    ctx.body = await AssessmentModel.findAll({
      where: {
        status: TemplateStatus.active,
      },
      attributes: [],
      include: {
        model: GroupModel,
        attributes: [],
        where: {
          status: TemplateGroupStatus.active
        },
        include: [{
          model: QuestionModel,
          attributes: [],
          where: {
            status: TemplateQuestionStatus.active
          },
          include: [{
            model: FileModel,
            attributes: [],
            where: {
              status: FileStatus.active
            },
          }]
        }]
      }
    });
  }
}

export default new AssessmentController;