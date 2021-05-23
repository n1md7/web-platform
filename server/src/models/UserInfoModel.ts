import {Column, ForeignKey, HasOne, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import OrganisationModel from "./OrganisationModel";
import UserModel from "./UserModel";

@Table({
  tableName: 'userInfo',
  timestamps: true

})
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

  @ForeignKey(() => OrganisationModel)
  @Column
  organisationId: number;

  @Column
  dateOfBirth: Date;

  @HasOne(() => OrganisationModel)
  organisation?: OrganisationModel
}
