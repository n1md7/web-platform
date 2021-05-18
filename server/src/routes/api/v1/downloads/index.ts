import Router from "@koa/router";
import DownloadController from "../../../../controllers/v1/DownloadController";
import authValidator from '../../../../middlewares/authValidator';

const downloadRouter = new Router();

downloadRouter.get('/download/:fileHash', authValidator, DownloadController.downloadFile);

export default downloadRouter;
