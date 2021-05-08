import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey, HasMany,
} from 'sequelize-typescript';
import AnswerModel from "./AnswerModel";
import GroupModel from "./GroupModel";

@Table({
  tableName: 'AssessmentQuestions',
  timestamps: true
})
export default class QuestionModel extends Model {
  @PrimaryKey
  @Column
  id!: number;

  @ForeignKey(() => GroupModel)
  @Column
  groupId!: number;

  @Column
  text!: string;

  @Column
  status!: string;

  @HasMany(() => AnswerModel)
  answers: AnswerModel[]
}


