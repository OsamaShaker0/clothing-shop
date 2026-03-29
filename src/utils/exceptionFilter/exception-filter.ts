import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseStructureInterface } from '../responseStructure/response-structure.interface';

@Catch()
export class ResponseExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;
    let error: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
        error = res;
      } else if (typeof res === 'object' && res !== null) {
        const obj: any = res;
        message = obj.message || obj.error || 'Something went wrong';
        error = obj;
      } else {
        message = 'Something went wrong';
        error = res;
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
      error = exception;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = exception;
    }

    const formattedResponse: ResponseStructureInterface<null> = {
      apiVersion: process.env.API_VERSION ?? '1.0.0',
      status: 'error',
      message,
      data: null,
      error,
    };

    response.status(status).json(formattedResponse);
  }
}
