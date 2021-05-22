import {AutoIncrement, Column, DataType, HasMany, HasOne, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import {UserRole, UserStatus} from "../controllers/v1/UserController";
import AssessmentModel from "./AssessmentModel";
import UserInfoModel from "./UserInfoModel";

export type UserType = {
  id: number;
  password: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
};


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
