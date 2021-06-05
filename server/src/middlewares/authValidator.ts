import JsonWebToken from "jsonwebtoken";
import {Context, Next} from 'koa';
import NodeCache from "node-cache";
import {JwtPayload} from '../controllers/v1/UserController';
import UserInfoModel from "../models/UserInfoModel";
import UserModel from "../models/UserModel";

export const usersInfoCache = new NodeCache({
    checkperiod: 0
});

export default async function authValidator(ctx: Context, next: Next): Promise<void> {
    const token = ctx.get(process.env.JWT_HEADER_NAME);
    const claims: JwtPayload = await JsonWebToken.verify(token, process.env.JWT_SECRET);
    ctx.user = usersInfoCache.get(claims.email);
    ctx.store = claims;

    if (!usersInfoCache.has(claims.email)) {
        const user = await UserModel.findOne({
            where: {
                id: claims.userId
            },
            attributes: ['id', 'email', 'role', 'plan', 'status'],
            include: {
                model: UserInfoModel
            }
        });
        usersInfoCache.set(claims.email, {
            id: user.id,
            email: user.email,
            role: user.role,
            plan: user.plan,
            status: user.status,
            userInfo: user.userInfo
        });
        ctx.user = user;
    }

    await next();
}
