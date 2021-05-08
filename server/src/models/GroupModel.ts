import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey, HasMany,
} from 'sequelize-typescript';
import AssessmentModel from "./AssessmentModel";
import QuestionModel from "./QuestionModel";

@Table({
  tableName: 'groups',
  timestamps: true
})
export default class GroupModel extends Model {
  @PrimaryKey
  @Column
  id!: number;

  @ForeignKey(() => AssessmentModel)
  @Column
  templateId!: number;

  @Column
  text!: string;

  @Column
  status!: string;

  @HasMany(() => QuestionModel)
  questions?: QuestionModel[]
}
