import {AutoIncrement, Column, ForeignKey, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import TemplateGroupModel from "./TemplateGroupModel";

export enum TemplateQuestionStatus {
  active = 'active',
  hidden = 'hidden',
  removed = 'removed'
}

@Table({
  tableName: 'templateQuestions',
  timestamps: true
})
export default class TemplateQuestionModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => TemplateGroupModel)
  @Column
  groupId!: number;

  @Column
  text!: string;

  @Column
  status!: string;
}
