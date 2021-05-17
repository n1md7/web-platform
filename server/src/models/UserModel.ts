import {AutoIncrement, Column, DataType, HasMany, HasOne, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import {UserRole, UserStatus} from "../types/user";
import AssessmentModel from "./AssessmentModel";
import UserInfoModel from "./UserInfoModel";


@Table({
  tableName: 'users',
  timestamps: true
})
export default class UserModel extends Model {
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
