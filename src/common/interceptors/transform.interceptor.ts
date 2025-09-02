// src/common/interceptors/transform.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { ApiResponse } from "../types/api-response.interface"

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    _: ExecutionContext,
    next: CallHandler<T>
  ): Observable<ApiResponse<T>> {
    // After finish controller, call this wrapper
    return next.handle().pipe(
      map((data: any) => {
        if (
          data &&
          typeof data === "object" &&
          "success" in data && //prevent from dubble wrap
          ("data" in data || "message" in data)
        ) {
          return data as ApiResponse<T>
        }
        return { success: true, data } as ApiResponse<T>
      })
    )
  }
}
