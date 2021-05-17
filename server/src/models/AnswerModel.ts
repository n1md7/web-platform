import {AutoIncrement, Column, ForeignKey, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import QuestionModel from "./QuestionModel";

export enum AnswerStatus {
  active = 'active',
  hidden = 'hidden'
}

@Table({
  tableName: 'answers',
  timestamps: true
})
export default class AnswerModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => QuestionModel)
  @Column
  questionId!: number;

  @Column
  text!: string;

  @Column
  status!: AnswerStatus;
}
