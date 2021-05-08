import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
} from 'sequelize-typescript';
import TemplateGroupModel from "./TemplateGroupModel";

@Table({
  tableName: 'templateQuestions',
  timestamps: true
})
export default class TemplateQuestionModel extends Model {
  @PrimaryKey
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
