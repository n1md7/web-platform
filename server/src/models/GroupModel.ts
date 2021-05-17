import {AutoIncrement, Column, ForeignKey, HasMany, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import AssessmentModel from "./AssessmentModel";
import QuestionModel from "./QuestionModel";
import {TemplateGroupStatus} from "./TemplateGroupModel";

@Table({
  tableName: 'groups',
  timestamps: true
})
export default class GroupModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => AssessmentModel)
  @Column
  assessmentId!: number;

  @Column
  text!: string;

  @Column
  status!: TemplateGroupStatus;

  @HasMany(() => QuestionModel)
  questions?: QuestionModel[]
}
