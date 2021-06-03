import dotenv from "dotenv";

dotenv.config();

import db from "../../database";
import config from "../../config";
import Server from "../../server";
import logWrite from '../../logger';
import createSuperAdmin from "./createSuperAdmin";

(async () => {
  config.server.port = Number(process.env.KOA_SEEDER_PORT) || 8761;
  try {
    // When DB is not accessible fail the app
    await db.authenticate();
    // Start Koa server
    const koa = new Server(config);
    koa.init();
    koa.startServer();
    logWrite.info('Starting custom seeder...');

    await createSuperAdmin().catch(console.error);
    logWrite.info('Super-admin created');

    logWrite.info('Seeding finished. Stopping server...');
    koa.httpServer.close();
    logWrite.info('koa server stopped!');
  } catch (error) {
    logWrite.error(JSON.stringify(error));
    process.exit(1);
  }
})();