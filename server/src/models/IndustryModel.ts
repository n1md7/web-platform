import {AutoIncrement, Column, DataType, Model, PrimaryKey, Table,} from 'sequelize-typescript';

@Table({
  tableName: 'industry',
  timestamps: true
})
export default class IndustryModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column(DataType.STRING)
  name: string;
}
