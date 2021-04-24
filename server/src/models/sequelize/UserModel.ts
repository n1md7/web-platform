import BaseModelSequelize from '../BaseModelSequelize';
import model, {tableName} from '../../database/sequelize/schema/User';
import StringUtils from '../../helpers/StringUtils';
import {Op} from 'sequelize';

export type RequestAuthType = {
    username: string;
    password: string;
};

export type RequestUserType = {
    confirmPassword: string;
    email: string;
} & RequestAuthType;

export type UserType = {
    id: number;
    username: string;
    password: string;
    email: string;
    role: number;
    active: number;
    createdAt: Date;
    updatedAt: Date;
};

export enum UserRole {
    basic = 1,
    admin,
}

export enum UserStatus {
    active = 1,
    disabled,
    blocked
}

export default class UserModel extends BaseModelSequelize<typeof model> {

    constructor() {
        super(model, tableName);
    }

    public async addNewUser(requestParam: RequestUserType): Promise<UserType> {
        const resultRow = await this.model.findOne({
            where: {
                [Op.or]: [
                    {username: requestParam.username},
                    {email: requestParam.email}
                ]
            }
        });

        if (resultRow) {
            throw new Error(`such username/email already taken`);
        }

        const passwordHash = await StringUtils.hashPassword(requestParam.password);
        return await this.model.create({
            username: requestParam.username,
            password: passwordHash,
            email: requestParam.email,
            role: UserRole.basic,
            active: UserStatus.active
        });
    }

    public async credentialsAreValid(requestParam: RequestAuthType): Promise<boolean | UserType> {
        const resultRow = await this.model.findOne({
            where: {
                username: requestParam.username,
            }
        });
        // No such user record in the Database
        if (!resultRow) {
            return false;
        }
        const user = resultRow.dataValues as UserType;
        const hash = user.password;
        const isValid = await StringUtils.hashCompare(requestParam.password, hash);

        if (!isValid) {
            return false;
        }

        return user;
    }
}