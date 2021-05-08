import {
  Table,
  Column,
  Model,
  PrimaryKey, HasMany, ForeignKey,
} from 'sequelize-typescript';
import TemplateQuestionModel from "./TemplateQuestionModel";
import TemplateModel from "./TemplateModel";

@Table({
  tableName: 'templateGroups',
  timestamps: true
})
export default class TemplateGroupModel extends Model {
  @PrimaryKey
  @Column
  id!: number;

  @ForeignKey(() => TemplateModel)
  @Column
  templateId!: number;

  @Column
  text!: string;

  @Column
  status!: string;

  @HasMany(() => TemplateQuestionModel)
  questions?: TemplateQuestionModel[]
}
