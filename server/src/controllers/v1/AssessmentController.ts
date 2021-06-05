import Joi from "joi";
import AnswerModel, {AnswerStatus} from "../../models/AnswerModel";
import AssessmentModel from "../../models/AssessmentModel";
import FileModel, {FileOwner, FileStatus} from "../../models/FileModel";
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
    // ToDo: Organisation value check. When empty should not be able to perform any actions
    const template = await TemplateService.getTemplateDetailsById(validated.templateId);
    // Create assessment
    const assessment = await AssessmentModel.create({
      userId: ctx.store.userId,
      templateId: template.id,
      name: template.name,
      organisationId: ctx.user.userInfo?.organisationId,
      createdBy: ctx.store.userId,
      status: TemplateStatus.active
    });
    // Create groups
    for await (const group of template.groups) {
      const newGroup = await GroupModel.create({
        assessmentId: assessment.id,
        text: group.text,
        userId: ctx.store.userId,
        status: TemplateGroupStatus.active
      });
      // Create questions
      for await (const question of group.questions) {
        await QuestionModel.create({
          groupId: newGroup.id,
          text: question.text,
          userId: ctx.store.userId,
          status: TemplateQuestionStatus.active
        });
      }
    }

    ctx.status = HttpCode.created;
  }

  public async getAssessmentList(ctx: MyContext): Promise<void> {
    ctx.body = await AssessmentModel.findAll({
      where: {
        status: TemplateStatus.active,
        userId: ctx.store.userId,
      }
    });
  }

  public async getAssessmentDetails(ctx: MyContext): Promise<void> {
    ctx.body = await AssessmentModel.findAll({
      where: {
        // Get data only associated with auth user company
        userId: ctx.store.userId
      },
      attributes: ['id', 'name', 'status', 'createdAt', 'updatedAt'],
      include: {
        model: GroupModel,
        include: [{
          attributes: ['id', 'text', 'groupId'],
          model: QuestionModel,
          include: [{
            model: AnswerModel,
            // overrides default innerJoin behaviour. To get nested lower level data when no answers
            required: false,
            where: {
              status: AnswerStatus.active
            }
          }, {
            model: FileModel,
            // No innerJoin for this
            required: false,
            where: {
              status: FileStatus.active,
              owner: FileOwner.question,
            }
          }]
        }]
      }
    });
  }

  public async getAssessmentDetailsById(ctx: MyContext): Promise<void> {
    type AssessmentReqType = {
      assessmentId: number;
    };
    const bodySchema = Joi.object({
      assessmentId: Joi.number().positive().label('Assessment ID'),
    });
    const validated = AssessmentController.assert<AssessmentReqType>(bodySchema, ctx.params);

    ctx.body = await AssessmentModel.findOne({
      where: {
        id: validated.assessmentId,
        userId: ctx.store.userId
      },
      attributes: ['id', 'name', 'status', 'createdAt', 'updatedAt'],
      include: {
        model: GroupModel,
        include: [{
          attributes: ['id', 'text', 'groupId'],
          model: QuestionModel,
          include: [{
            model: AnswerModel,
            // overrides default innerJoin behaviour. To get nested lower level data when no answers
            required: false,
            where: {
              status: AnswerStatus.active
            }
          }, {
            model: FileModel,
            // No innerJoin for this
            required: false,
            where: {
              status: FileStatus.active,
              owner: FileOwner.question,
            }
          }]
        }]
      }
    });
  }
}

export default new AssessmentController;