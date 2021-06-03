import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import {UserRole, UserStatus} from "../controllers/v1/UserController";
import AssessmentModel from "./AssessmentModel";
import UserInfoModel from "./UserInfoModel";

export type UserCreateType = {
  password: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  plan: UserPlan;
};

export type UserType = UserCreateType & {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export enum UserPlan {
  free = 'free',
  premium = 'premium'
}

@Table({
  tableName: 'users',
  timestamps: true
})
export default class UserModel extends Model {
  @PrimaryKey
  @ForeignKey(() => UserInfoModel)
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

  @Column
  plan: UserPlan;

  @BelongsTo(() => UserInfoModel)
  userInfo?: UserInfoModel

  @HasMany(() => AssessmentModel)
  assessments?: AssessmentModel
}
