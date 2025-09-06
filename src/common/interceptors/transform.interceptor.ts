import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"

/**
 * Transform Interceptor
 * 
 * Automatically wraps controller responses in a consistent format:
 * - Raw data → { "data": rawData }
 * - Already formatted { message?, data? } → unchanged
 * - null/undefined → {} (empty object)
 */

export interface ApiResponse<T = any> {
  message?: string
  data?: T
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    _: ExecutionContext,
    next: CallHandler<T>
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data: any) => {
        // If data is already in the correct format, return as is
        if (
          data &&
          typeof data === "object" &&
          ("message" in data || "data" in data)
        ) {
          return data as ApiResponse<T>
        }

        // If data is null/undefined, return empty response
        if (data === null || data === undefined) {
          return {} as ApiResponse<T>
        }

        // Default transformation: wrap data
        return { data } as ApiResponse<T>
      })
    )
  }
}
