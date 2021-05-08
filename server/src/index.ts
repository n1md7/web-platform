import dotenv from "dotenv";

dotenv.config();

import Database from "./database";
import config from "./config";
import Server from "./server";
import logWrite from './logger';

(async () => {
  try {
    // When DB is not accessible fail the app
    await Database.authenticate();
    // Start Koa server
    const koa = new Server(config);
    koa.init();
    koa.startServer();
  } catch (error) {
    logWrite.error(error.message || error.toString());
    process.exit(1);
  }
})();
