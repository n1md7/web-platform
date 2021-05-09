import {
  Table,
  Column,
  Model,
  HasOne,
  PrimaryKey, HasMany, DataType, AutoIncrement,
} from 'sequelize-typescript';
import {Optional} from 'sequelize';
import {UserRole, UserStatus} from "../types/user";
import AssessmentModel from "./AssessmentModel";
import UserInfoModel from "./UserInfoModel";


export type UserAttributes = {
  id: number;
  email: string;
  password: string;
  role: string;
  status: string;
}

@Table({
  tableName: 'users',
  timestamps: true
})
export default class UserModel extends Model<UserAttributes, Optional<UserAttributes, 'id'>> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column(DataType.TEXT)
  email: string;

  @Column
  password: string;

  @Column
  role: UserRole;

  @Column
  status: UserStatus;

  @HasOne(() => UserInfoModel)
  userInfo?: UserInfoModel

  @HasMany(() => AssessmentModel)
  assessments?: AssessmentModel
}
