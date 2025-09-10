// utils/uuid.service.ts
import { Injectable } from "@nestjs/common"
import { randomUUID } from "crypto"

@Injectable()
export class GenerateService {
  generateUUID(): string {
    return randomUUID()
  }
}
