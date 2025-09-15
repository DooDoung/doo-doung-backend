import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"

const formatDate = (date: Date): string => {
  return new Date(date).toISOString().split("T")[0]
}

const formatTime = (date: Date): string => {
  const d = new Date(date)
  const hours = d.getUTCHours().toString().padStart(2, "0")
  const minutes = d.getUTCMinutes().toString().padStart(2, "0")
  return `${hours}:${minutes}`
}

const formatResponseData = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(formatResponseData)
  }

  if (data && typeof data === "object") {
    const newData = { ...data }
    if (newData.date) {
      newData.date = formatDate(newData.date)
    }
    if (newData.startTime) {
      newData.startTime = formatTime(newData.startTime)
    }

    if (newData.add) newData.add = formatResponseData(newData.add)
    if (newData.delete) newData.delete = formatResponseData(newData.delete)

    return newData
  }

  return data
}

@Injectable()
export class AvailabilityFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => formatResponseData(data)))
  }
}
