import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseStructureInterface } from './response-structure.interface';
@Injectable()
export class ResponseStructureInterceptor<T> implements NestInterceptor<
  T,
  ResponseStructureInterface<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseStructureInterface<T>> {
    return next.handle().pipe(
      map((data) => {
        const response: ResponseStructureInterface<T> = {
          apiVersion: process.env.API_VERSION ?? '1.0.0',
          status: 'success',
          message: 'Request successful',
          data: data ?? null,
        };
        return response;
      }),
    );
  }
}
