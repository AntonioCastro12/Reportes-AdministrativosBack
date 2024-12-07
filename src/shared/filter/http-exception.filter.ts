import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let messageValidator = null;

    if (exception.getResponse() instanceof Object) {
      messageValidator = exception.getResponse();
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const messageError = exception.message.split(',', 2);

    const fields = request.body
      ? request.body
      : request.params
      ? request.params
      : request.query
      ? request.query
      : null;
    let errorResponse = new Object();

    if (
      status === HttpStatus.BAD_REQUEST ||
      status === HttpStatus.INTERNAL_SERVER_ERROR
    ) {
      errorResponse = {
        code: status,
        name: messageError[0],
        errors: [
          {
            path: request.url,
            method: request.method,
            message:
              messageValidator !== null
                ? messageValidator.message[0]
                : messageError[1],
            timestamp: new Date().toISOString(),
            parameters: fields,
          },
        ],
      };
    } else {
      errorResponse = {
        code: status,
        name: messageError[0],
        errors: [
          {
            path: request.url,
            method: request.method,
            message: messageError[0],
            timestamp: new Date().toISOString(),
          },
        ],
      };
    }

    response.status(status).json(errorResponse);
  }
}
