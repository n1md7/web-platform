import {AutoIncrement, Column, ForeignKey, HasMany, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import GroupModel from "./GroupModel";
import TemplateModel from "./TemplateModel";
import UserModel from "./UserModel";

@Table({
  tableName: 'assessments',
  timestamps: true
})
export default class AssessmentModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => UserModel)
  @Column
  userId!: number;

  @ForeignKey(() => TemplateModel)
  @Column
  templateId!: number;

  @Column
  name!: string;

  @Column
  status!: string;

  @HasMany(() => GroupModel)
  answers: GroupModel[]
}
