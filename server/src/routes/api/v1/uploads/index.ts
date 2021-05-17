import multer from '@koa/multer';
import Router from "@koa/router";
import UploadController, {UploadFieldName} from "../../../../controllers/v1/UploadController";
import authValidator from '../../../../middlewares/authValidator';

const uploadRouter = new Router();

uploadRouter.post('/upload', authValidator, multer().single(UploadFieldName), UploadController.uploadFile);

export default uploadRouter;
