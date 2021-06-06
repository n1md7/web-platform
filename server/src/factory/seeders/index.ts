import dotenv from "dotenv";

dotenv.config();

import db from "../../database";
import config from "../../config";
import Server from "../../server";
import logWrite from '../../logger';
import createSuperAdmin from "./createSuperAdmin";

(async () => {
  config.server.port = Number(process.env.KOA_SEEDER_PORT) || 8761;
  const koa = new Server(config);
  try {
    // When DB is not accessible fail the app
    await db.authenticate();
    // Start Koa server
    koa.init();
    koa.startServer();
    logWrite.info('Starting custom seeder...');

    const superAdmin = await createSuperAdmin()
      .catch(({details: [{message}]}) => {
        logWrite.warn(`Super-admin could not created. Reason: ${message};`);
      });
    if (superAdmin) {
      logWrite.info(`Super-admin created. Email: ${superAdmin.email};`);
    }

  } catch (error) {
    logWrite.error(JSON.stringify(error));
    process.exit(1);
  } finally {
    logWrite.info('Seeding finished. Stopping server...');
    koa.httpServer.close();
    logWrite.info('koa server stopped!');
    process.exit(0);
  }
})();