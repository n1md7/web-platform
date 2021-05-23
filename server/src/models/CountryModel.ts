import {AutoIncrement, Column, Model, PrimaryKey, Table,} from 'sequelize-typescript';

@Table({
  tableName: 'country',
  timestamps: true
})
export default class CountryModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  code: string;
}
