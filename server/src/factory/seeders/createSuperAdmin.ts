import {UserRole, UserStatus} from "../../controllers/v1/UserController";
import StringUtils from "../../helpers/StringUtils";
import {UserPlan, UserType} from "../../models/UserModel";
import UserService from "../../services/UserService";

export default async function createSuperAdmin(): Promise<UserType> {
  const password = process.env.SUPER_ADMIN_PASSWORD || 'super-admin-123';

  return UserService.createNewUser({
    email: process.env.SUPER_ADMIN_EMAIL || 'admin@example.com',
    role: UserRole.superAdmin,
    status: UserStatus.active,
    plan: UserPlan.premium,
    password: await StringUtils.hashPassword(password)
  });
}
