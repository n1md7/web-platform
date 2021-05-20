import TemplateGroupModel, {TemplateGroupStatus} from "../models/TemplateGroupModel";
import TemplateModel, {TemplateStatus} from "../models/TemplateModel";
import TemplateQuestionModel, {TemplateQuestionStatus} from "../models/TemplateQuestionModel";

export default class TemplateService {
  public static async getTemplateDetailsById(templateId: number): Promise<TemplateModel> {
    return TemplateModel.findOne({
      where: {
        status: TemplateStatus.active,
        id: templateId
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
