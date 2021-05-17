import {AutoIncrement, Column, ForeignKey, HasMany, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import AnswerModel from "./AnswerModel";
import GroupModel from "./GroupModel";
import {TemplateQuestionStatus} from "./TemplateQuestionModel";

@Table({
  tableName: 'questions',
  timestamps: true
})
export default class QuestionModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => GroupModel)
  @Column
  groupId!: number;

  @Column
  text!: string;

  @Column
  status!: TemplateQuestionStatus;

  @HasMany(() => AnswerModel)
  answers: AnswerModel[]
}
