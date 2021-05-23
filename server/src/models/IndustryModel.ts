import {AutoIncrement, Column, DataType, ForeignKey, HasOne, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import OrganisationModel from "./OrganisationModel";

@Table({
  tableName: 'industry',
  timestamps: true
})
export default class IndustryModel extends Model {
  @PrimaryKey
  @ForeignKey(() => OrganisationModel)
  @AutoIncrement
  @Column
  id: number;

  @Column(DataType.STRING)
  name: string;
}
