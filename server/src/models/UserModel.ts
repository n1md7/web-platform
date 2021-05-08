import {
  Table,
  Column,
  Model,
  HasOne,
  PrimaryKey, HasMany, DataType,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import AssessmentModel from "./AssessmentModel";
import UserInfoModel from "./UserInfoModel";
//
// interface UserAttributes {
//   id: number;
//   email: string;
//   password: string;
//   role: string;
//   status: string;
// }
//
// type UserCreationAttributes = Optional<UserAttributes, 'id'>
//

@Table({
  tableName: 'users',
  timestamps: true
})
export default class UserModel extends Model<UserModel> {
// export default class UserModel extends Model<UserAttributes, UserCreationAttributes> {
  @PrimaryKey
  @Column
  id: number;

  @Column(DataType.TEXT)
  email: string;

  @Column
  password: string;

  @Column
  role: string;

  @Column
  status: string;

  @HasOne(() => UserInfoModel)
  userInfo?: UserInfoModel

  @HasMany(() => AssessmentModel)
  assessments?: AssessmentModel
}
