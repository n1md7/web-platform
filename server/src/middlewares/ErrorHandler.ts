import {Context, Next} from "koa";
import {ExposeError} from "../controllers/Controller";
import {ErrorType, HttpCode, HttpText,} from "../types/errorHandler";


class ErrorHandler {
  static async handle(ctx: Context, next: Next): Promise<void> {
    await next().catch(error => {
      ErrorHandler.handleEverythingElse(error, ctx);
    });
  }

  private static buildErrorMessage(error: ExposeError, ctx: Context) {
    const status: number = error.status || ctx.status || HttpCode.internalServerError;
    const errorMessage: string = error.message || HttpText.internalServerError;

    return `[${error.name}:${status}] - [${errorMessage}] - ${JSON.stringify(error.details)}`;
  }

  private static handleEverythingElse(error: ExposeError, ctx: Context) {
    switch (error.name) {
      case ErrorType.exposeError:
        ctx.status = error.status;
        ctx.body = {
          message: error.message,
          details: error.details
        };
        break;
      case ErrorType.jsonWebTokenError:
      case ErrorType.tokenExpiredError:
        ctx.status = HttpCode.unauthorized;
        ctx.body = error.message;
        break;
      default:
        ctx.status = HttpCode.internalServerError;
        ctx.body = HttpText.internalServerError;
    }

    ctx.app.emit('error:server', ErrorHandler.buildErrorMessage(error, ctx));
  }
}

export default ErrorHandler.handle;