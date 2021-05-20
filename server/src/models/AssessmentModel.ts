import {AutoIncrement, Column, ForeignKey, HasMany, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import GroupModel from "./GroupModel";
import TemplateModel from "./TemplateModel";
import UserModel from "./UserModel";

export enum AssessmentStatus {
  active = 'active',
  hidden = 'hidden'
}

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
  status!: AssessmentStatus;

  @HasMany(() => GroupModel)
  groups: GroupModel[]
}
