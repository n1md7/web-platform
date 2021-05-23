import {AutoIncrement, Column, ForeignKey, HasOne, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import IndustryModel from "./IndustryModel";
import UserInfoModel from "./UserInfoModel";


export enum EntityType {
  individual = 'Individual',
  student = 'Student',
  LLC = 'LLC',
  LLP = 'LLP',
  charity = 'Charity',
  government = 'Government',
  other = 'other'
}

export enum CompanySize {
  large = 'Large',
  medium = 'Medium',
  small = 'Small',
  micro = 'Micro'
}

export enum CompanyStatus {
  confirmed = 'Confirmed',
  pendingApproval = 'pending-approval',
  hidden = 'hidden'
}

export type OrganisationType = {
  id: number;
  name: string;
  website: string;
  entityType: EntityType;
  industryId: number;
  registeredNumber: number;
  street: string;
  cityOrTown: string;
  countryOrState: string;
  postCode: number;
  country: string;
  size: CompanySize;
  status: CompanyStatus;
  industry?: IndustryModel
}

@Table({
  tableName: 'organisation',
  timestamps: true
})
export default class OrganisationModel extends Model {
  @PrimaryKey
  @ForeignKey(() => UserInfoModel)
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  website: string;

  @Column
  entityType: EntityType;

  @ForeignKey(() => IndustryModel)
  @Column
  industryId: number;

  @Column
  registeredNumber: number;

  @Column
  street: string;

  @Column
  cityOrTown: string;

  @Column
  countryOrState: string;

  @Column
  postCode: number;

  @Column
  country: string;

  @Column
  size: CompanySize;

  @Column
  status: CompanyStatus;

  @HasOne(() => IndustryModel)
  industry?: IndustryModel
}
