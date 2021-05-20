import {FileExtension, MimeType} from 'file-type';
import {AutoIncrement, Column, ForeignKey, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import QuestionModel from "./QuestionModel";
import UserModel from "./UserModel";

export enum FileOwner {
  user = 'user',
  question = 'question'
}

export enum FileStatus {
  active = 'active',
  removed = 'removed'
}

export type FileType = {
  id: number;
  ownerId: number;
  owner: FileOwner;
  originalName: string;
  name: string;
  extension: string;
  mime: MimeType;
  status: FileStatus;
  createdAt: Date;
  updatedAt: Date;
}

@Table({
  tableName: 'files',
  timestamps: true
})
export default class FileModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => QuestionModel)
  @ForeignKey(() => UserModel)
  @Column
  ownerId!: number;

  @Column
  owner!: FileOwner;

  @Column
  originalName!: string;

  @Column
  name!: string;

  @Column
  extension!: FileExtension;

  @Column
  mime!: MimeType;

  @Column
  status!: FileStatus;
}
