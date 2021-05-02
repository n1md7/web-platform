import StringUtils from '../../helpers/StringUtils';
import Sequelize, {Op} from 'sequelize';
import sequelize from "../../database/sequelize/Sequelize";
import {RequestAuthType, RequestUserType, UserRole, UserStatus, UserType} from "../../types/user";

export default class UserModel {

  protected model;
  protected tableName;

  constructor() {
    this.tableName = 'users';
    this.model = sequelize.define(this.tableName, {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: Sequelize.STRING(128),
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(512),
        allowNull: false
      },
      firstName: Sequelize.STRING(32),
      middleName: Sequelize.STRING(32),
      lastName: Sequelize.STRING(32),
      organization: Sequelize.STRING(128),
      dateOfBirth: Sequelize.DATE(),
      role: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(64),
        allowNull: false
      }
    }, {
      tableName: this.tableName,
      timestamps: true
    });
  }

  public async addNewUser(requestParam: RequestUserType): Promise<UserType> {
    const resultRow = await this.model.findOne({
      where: {
        [Op.or]: [
          {email: requestParam.email}
        ]
      }
    });

    if (resultRow) {
      throw new Error(`such username/email already taken`);
    }

    const passwordHash = await StringUtils.hashPassword(requestParam.password);
    return await this.model.create({
      email: requestParam.email,
      password: passwordHash,
      role: UserRole.basic,
      active: UserStatus.active
    });
  }

  public async credentialsAreValid(requestParam: RequestAuthType): Promise<boolean | UserType> {
    const resultRow = await this.model.findOne({
      where: {
        email: requestParam.email,
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