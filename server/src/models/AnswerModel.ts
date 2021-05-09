import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
  AutoIncrement,
} from 'sequelize-typescript';
import QuestionModel from "./QuestionModel";

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
  status!: string;
}
