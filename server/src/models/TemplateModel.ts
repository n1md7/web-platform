import {
  Table,
  Column,
  Model,
  PrimaryKey,
  HasMany, AutoIncrement,
} from 'sequelize-typescript';
import AssessmentModel from "./AssessmentModel";
import TemplateGroupModel from "./TemplateGroupModel";

export enum TemplateStatus {
  active = 'active',
  hidden = 'hidden'
}

@Table({
  tableName: 'templates',
  timestamps: true
})
export default class TemplateModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  status: TemplateStatus;

  @HasMany(() => AssessmentModel)
  assessments: AssessmentModel

  @HasMany(() => TemplateGroupModel)
  groups: TemplateGroupModel[]
}


