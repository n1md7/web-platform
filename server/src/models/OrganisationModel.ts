import {AutoIncrement, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import CountryModel from "./CountryModel";
import IndustryModel from "./IndustryModel";


export enum EntityType {
  individual = 'Individual',
  student = 'Student',
  LLC = 'LLC',
  LLP = 'LLP',
  charity = 'Charity',
  government = 'Government',
  other = 'Other'
}

export enum CompanySize {
  large = 'Large',
  medium = 'Medium',
  small = 'Small',
  micro = 'Micro'
}

export enum CompanyStatus {
  active = 'active',
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
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  website: string;

  @Column
  entityType: EntityType;

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
  size: CompanySize;

  @Column
  status: CompanyStatus;

  @ForeignKey(() => CountryModel)
  @Column
  countryId: number;

  @ForeignKey(() => IndustryModel)
  @Column
  industryId: number;

  @BelongsTo(() => IndustryModel)
  industry?: IndustryModel

  @BelongsTo(() => CountryModel)
  country?: CountryModel
}
