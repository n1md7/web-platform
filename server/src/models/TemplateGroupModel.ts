import {AutoIncrement, Column, ForeignKey, HasMany, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import TemplateModel from "./TemplateModel";
import TemplateQuestionModel from "./TemplateQuestionModel";

export enum TemplateGroupStatus {
  active = 'active',
  hidden = 'hidden'
}

export type TemplateGroupType = {
  id: number;
  templateId: number;
  text: string;
  status?: TemplateGroupStatus;
  createdAt?: Date;
  updatedAt?: Date;
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
