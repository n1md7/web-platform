import {
  Table,
  Column,
  Model,
  ForeignKey,
  PrimaryKey,
} from 'sequelize-typescript';
import UserModel from "./UserModel";

@Table({tableName: 'userInfo'})
export default class UserInfoModel extends Model {
  @PrimaryKey
  @Column
  id: number;

  @ForeignKey(() => UserModel)
  @Column
  userId: number;

  @Column
  firstName: string;

  @Column
  middleName: string;

  @Column
  lastName: string;

  @Column
  organization: string;

  @Column
  dateOfBirth: Date;

  @Column
  createdAt: Date

  @Column
  updatedAt: Date
}
