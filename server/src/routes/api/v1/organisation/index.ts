import Router from "@koa/router";
import OrganisationController from "../../../../controllers/v1/OrganisationController";
import {UserRole} from "../../../../controllers/v1/UserController";
import allowAccess from "../../../../middlewares/allowAccess";
import authValidator from '../../../../middlewares/authValidator';

const organisation = new Router();
const adminAndManagerAccess = allowAccess([UserRole.companyManager, UserRole.admin, UserRole.bot]);

organisation.get('/organisation/:id', authValidator, adminAndManagerAccess, OrganisationController.getOrganisationById);

organisation.post('/organisation', authValidator, adminAndManagerAccess, OrganisationController.create);

export default organisation;
