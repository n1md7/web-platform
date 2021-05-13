import dotenv from "dotenv";

dotenv.config();

import database from "./database";
import config from "./config";
import Server from "./server";
import logWrite from './logger';

(async koa => {
  try {
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
