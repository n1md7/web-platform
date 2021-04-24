import Koa from "koa";
import serve from "koa-static";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import logWrite from "../logger";
import routes from "../routes";
import handleErrors from "../middlewares/ErrorHandler";
import {Env} from "../types";
import {ConfigOptions} from "../types/config";
import path from "path";
import http, {Server as HttpServer} from "http";
import SocketIO, {Server as SocketIoServer} from "socket.io"
import SocketModule from "../socket";
import serveIndexHTML from '../middlewares/serveIndexHTML';
import handleApiNotFound from '../middlewares/handleApiNotFound';
import swagger, {loadDocumentSync} from 'swagger2';
import {ui} from "swagger2-koa";

export default class Server {
  koa: Koa;
  io: SocketIoServer;
  config: ConfigOptions;
  httpServer: HttpServer;
  staticFolderPath: string;
  socketModule: SocketModule;
  swaggerDocument: swagger.Document;

  constructor(config: ConfigOptions) {
    this.config = config;
    // Makes publicly accessible React build folder
    this.staticFolderPath = path.join(__dirname, config.server.staticFolderPath);
    // Allow any cross-domain requests when not Production environment
    if (process.env.NODE_ENV === Env.Prod) {
      this.config.origin = process.env.ORIGIN;
    }
    this.swaggerDocument = loadDocumentSync(path.join(__dirname, config.server.swaggerApiPath)) as swagger.Document;
  }

  init(): Server {
    this.koa = new Koa();
    this.httpServer = http.createServer(this.koa.callback());
    const router = routes(this.config);
    const indexHTMLPath = path.join(
      this.staticFolderPath,
      this.config.server.indexFile,
    );
    if (process.env.NODE_ENV !== Env.Prod) {
      this.koa.use(ui(this.swaggerDocument, this.config.server.swaggerContextPath));
    }
    this.koa.use(handleErrors);
    this.koa.use(cors({
      origin: this.config.origin,
      credentials: true,
    }));
    this.koa.use(bodyParser());
    this.koa.use(router.allowedMethods());
    this.koa.use(router.routes());
    // Serve files from public static folder
    this.koa.use(serve(this.staticFolderPath));
    // When not found request goes to api endpoint return JSON formatted error
    this.koa.use(handleApiNotFound(this.config.server.apiContextPath, this.koa));
    // Redirect everything else to index.html - for React-router
    this.koa.use(serveIndexHTML(indexHTMLPath, this.koa));
    this.koa.on('error:server', errorMessage => {
      logWrite.error(`[server] ${errorMessage}`);
    });
    this.koa.on('error:socket', errorMessage => {
      logWrite.error(`[socket] ${errorMessage}`);
    });
    this.koa.on('debug', debugMessage => {
      logWrite.error(`${debugMessage}`);
    });

    return this;
  }

  startSocket(): SocketModule {
    // eslint-disable-next-line
    // @ts-ignore
    this.io = SocketIO(this.httpServer, {
      path: '/socket.io',
      serveClient: false,
      // below are engine.IO options
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
    });
    this.socketModule = new SocketModule(this.io, this.koa);
    this.socketModule.connectionHandler();
    this.socketModule.sendUpdatesEvery(100)("milliseconds");

    return this.socketModule;
  }

  startServer(): HttpServer {
    const {port, hostname, swaggerContextPath} = this.config.server;

    return this.httpServer.listen(port, hostname, () => {
      logWrite.debug(`Health-check - http://${hostname}:${port}/health-check`);
      logWrite.debug(`Swagger UI - http://${hostname}:${port}/${swaggerContextPath}`);
      logWrite.debug('Server (re)started!');
    });
  }
}
