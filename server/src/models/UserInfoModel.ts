import {BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import OrganisationModel, {OrganisationType} from "./OrganisationModel";

export type UserInfoType = {
  userId: number;
  firstName: string;
  middleName: string
  lastName: string;
  dateOfBirth: Date;
  organisationId: number;
  organisation: OrganisationType
}

@Table({
  tableName: 'userInfo',
  timestamps: true
})
export default class UserInfoModel extends Model {
  @PrimaryKey
  @Column
  userId: number;

  @Column
  firstName: string;

  @Column
  middleName: string;

  @Column
  lastName: string;

  @Column
  dateOfBirth: Date;

  @ForeignKey(() => OrganisationModel)
  @Column
  organisationId: number;

  @BelongsTo(() => OrganisationModel)
  organisation?: OrganisationModel
}
