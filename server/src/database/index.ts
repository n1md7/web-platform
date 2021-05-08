import {Sequelize} from 'sequelize-typescript';
import AnswerModel from "../models/AnswerModel";
import AssessmentModel from "../models/AssessmentModel";
import GroupModel from "../models/GroupModel";
import QuestionModel from "../models/QuestionModel";
import TemplateGroupModel from "../models/TemplateGroupModel";
import TemplateModel from "../models/TemplateModel";
import TemplateQuestionModel from "../models/TemplateQuestionModel";
import UserInfoModel from "../models/UserInfoModel";
import UserModel from "../models/UserModel";

const connection = new Sequelize({
  dialect: "mysql",
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USER,
  database: process.env.MYSQL_DB,
  password: process.env.MYSQL_PASS,
  port: Number(process.env.MYSQL_PORT),
});

connection.addModels([
  UserModel,
  UserInfoModel,
  AssessmentModel,
  AnswerModel,
  GroupModel,
  QuestionModel,
  TemplateModel,
  TemplateGroupModel,
  TemplateQuestionModel
]);
// connection.addModels([path.join(__dirname + '../models/*')]);

export default connection;