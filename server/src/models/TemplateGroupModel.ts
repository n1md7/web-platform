import {
  Table,
  Column,
  Model,
  PrimaryKey, HasMany, ForeignKey, AutoIncrement,
} from 'sequelize-typescript';
import TemplateQuestionModel from "./TemplateQuestionModel";
import TemplateModel from "./TemplateModel";

export enum TemplateGroupStatus {
  active = 'active',
  hidden = 'hidden'
}

@Table({
  tableName: 'templateGroups',
  timestamps: true
})
export default class TemplateGroupModel extends Model {
  @PrimaryKey
  @AutoIncrement
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
