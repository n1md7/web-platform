import Router from "@koa/router";
import { ConfigOptions } from "../types/config";
import apiV1Router from "./api/v1";

export default ( config: ConfigOptions): Router => {

  const router = new Router();
  // add api endpoints
  router.use(config.server.apiContextPath, apiV1Router.routes());

  router.get( '/health-check', ctx => {
    ctx.body = {
      status: 'UP',
      version: process.env.VERSION || '1.0.0'
    };
  } );

  return router;
};
