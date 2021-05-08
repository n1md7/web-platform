import {
  Table,
  Column,
  Model,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript';
import AssessmentModel from "./AssessmentModel";
import TemplateGroupModel from "./TemplateGroupModel";

@Table({
  tableName: 'templates',
  timestamps: true
})
export default class TemplateModel extends Model {
  @PrimaryKey
  @Column
  id: number;

  @Column
  name: string;

  @Column
  status: string;

  @HasMany(() => AssessmentModel)
  assessments: AssessmentModel

  @HasMany(() => TemplateGroupModel)
  groups: TemplateGroupModel[]
}


