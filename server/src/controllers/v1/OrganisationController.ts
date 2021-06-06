import Joi from "joi";
import OrganisationModel, {CompanySize, CompanyStatus, EntityType} from "../../models/OrganisationModel";
import UserInfoModel from "../../models/UserInfoModel";
import {HttpCode} from "../../types/errorHandler";
import {MyContext} from "../../types/koa";
import Controller, {ExposeError} from "../Controller";


class OrganisationController extends Controller {
  public async create(ctx: MyContext): Promise<void> {
    const createSchema = Joi.object({
      name: Joi.string().max(128).required().label('Company name'),
      countryId: Joi.number().required().label('Country'),
      industryId: Joi.number().required().label('Industry'),
      registeredNumber: Joi.string().min(6).max(64).required().label('Company registered number'),
      size: Joi.string().required().valid(
        CompanySize.large, CompanySize.medium, CompanySize.micro, CompanySize.small
      ).label('Company size'),
      entityType: Joi.string().valid(
        EntityType.individual, EntityType.LLC, EntityType.LLP, EntityType.charity, EntityType.other, EntityType.government
      ).required().label('Entity type'),
      website: Joi.string().min(3).max(128).optional().label('Company website'),
      street: Joi.string().max(128).optional().label('Street'),
      cityOrTown: Joi.string().max(64).optional().label('City or town'),
      countryOrState: Joi.string().max(64).optional().label('Country or state'),
      postCode: Joi.string().max(64).optional().label('Post code'),
    });
    const validated = OrganisationController.assert<{
      name: string;
      countryId: number;
      industryId: number;
      registeredNumber: string;
      size: CompanySize;
      entityType: EntityType;
      website: string;
      street: string;
      cityOrTown: string;
      countryOrState: string;
      postCode: string;
    }>(createSchema, ctx.request.body);

    if (ctx.user.userInfo?.organisationId) {
      // User already has company associated
      // Do not allow create another company
      throw new ExposeError(OrganisationController.composeJoyErrorDetails([{
          message: 'You are not allowed to create more then one organisation',
        }]), {
          status: HttpCode.forbidden
        }
      );
    }

    const org = await OrganisationModel.create({
      ...validated,
      status: CompanyStatus.pendingApproval,
      createdBy: ctx.user.id
    });

    // Update userInfo by adding Organisation ID
    await UserInfoModel.upsert({
      userId: ctx.user.id,
      organisationId: org.id
    });

    ctx.status = HttpCode.created;
  }

  public async getOrganisationById(ctx: MyContext): Promise<void> {
    const validated = OrganisationController.assert<{ id: number }>(Joi.object({
      id: Joi.number().max(128).required().label('Company ID'),
    }), ctx.params);
    const org = await OrganisationModel.findByPk(validated.id);
    if (!org) {
      throw new ExposeError(OrganisationController.composeJoyErrorDetails([{
          message: 'Such organisation does not exist',
          key: 'id',
          value: String(validated.id)
        }]), {
          status: HttpCode.badRequest
        }
      );
    }

    if (org.createdBy === ctx.user.id || ctx.user.userInfo.organisationId === org.id) {
      // When organisation is created by current user or (s)he is the company owner
      ctx.body = org;
      return;
    }

    throw new ExposeError(OrganisationController.composeJoyErrorDetails([{
        message: 'You are not allowed to access this organisation',
      }]), {
        status: HttpCode.forbidden
      }
    );
  }

}

export default new OrganisationController;