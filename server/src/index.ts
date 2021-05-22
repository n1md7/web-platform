import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

import database from "./database";
import config from "./config";
import Server from "./server";
import logWrite from './logger';

(async koa => {
  try {
    // Create upload directory if does not exist
    if (!fs.existsSync(config.server.uploadDir)) {
      logWrite.info(`Directory [${config.server.uploadDir}] does not exist. Creating...`);
      fs.mkdirSync(config.server.uploadDir);
      logWrite.info(`Directory for user uploads created!`);
    }
    // When DB is not accessible fail the app
    await database.authenticate();
    // Start Koa server
    koa.init();
    koa.startServer();
  } catch (error) {
    logWrite.error(error.message || error.toString());
    process.exit(1);
  }
})(new Server(config));
