import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface Response<T> {
  data: T;
}

export class FormatExternalRepoResponse<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const formattedReponse = {
          alreadyExisted: [],
          newRepository: [],
        };
        data.forEach((element) => {
          typeof element === 'string'
            ? formattedReponse.alreadyExisted.push(element)
            : formattedReponse.newRepository.push(element);
        });
        data = formattedReponse;
        return data;
      }),
    );
  }
}
