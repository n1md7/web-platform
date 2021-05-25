import {Context, Next} from "koa";
import Controller, {ExposeError} from "../controllers/Controller";
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

    ctx.app.emit('error:server', `[${error.name}:${status}] - [${errorMessage}] - ${JSON.stringify(error.details)}`);
    if (status === 500) {
      // Log more error details when 500
      ctx.app.emit('error:server', error.stack);
    }
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
        ctx.body = {
          message: HttpText.unauthorized,
          details: Controller.composeJoyErrorDetails([{
            message: error.message,
            value: ctx.get(process.env.JWT_HEADER_NAME),
            key: process.env.JWT_HEADER_NAME,
            label: 'Authentication header'
          }])
        }
        ctx.status = HttpCode.unauthorized;
        break;
      default:
        ctx.status = HttpCode.internalServerError;
        ctx.body = HttpText.internalServerError;
    }

    ErrorHandler.buildErrorMessage(error, ctx);
  }
}

export default ErrorHandler.handle;