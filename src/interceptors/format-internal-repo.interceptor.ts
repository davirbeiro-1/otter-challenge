import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Repository } from 'src/shared/type/saved-repository.type';

export interface Response<T> {
  data: T;
}

export class FormatInternalRepoResponse<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        return data.map((element: Repository) => {
          delete element.id;
          delete element.userId;
          return element;
        });
      }),
    );
  }
}
