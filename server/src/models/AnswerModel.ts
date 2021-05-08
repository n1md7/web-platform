import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
} from 'sequelize-typescript';
import QuestionModel from "./QuestionModel";

@Table({
  tableName: 'answers',
  timestamps: true
})
export default class AnswerModel extends Model {
  @PrimaryKey
  @Column
  id!: number;

  @ForeignKey(() => QuestionModel)
  @Column
  questionId!: number;

  @Column
  text!: string;

  @Column
  status!: string;
}
