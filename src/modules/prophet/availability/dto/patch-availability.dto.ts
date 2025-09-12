import { Type, Transform } from "class-transformer"
import { IsArray, IsIn, IsDate, ValidateNested } from "class-validator"

const parseTimeString = (value: any): Date => {
  console.log("Received value for time:", value)
  console.log("Is it a string?", typeof value === "string")
  console.log("Does it match regex?", /^\d{2}:\d{2}$/.test(value))

  if (typeof value === "string" && /^\d{2}:\d{2}$/.test(value)) {
    const result = new Date(`1970-01-01T${value}:00.000Z`)
    console.log("Returning valid date:", result)
    return result
  }

  const invalidResult = new Date("invalid date")
  console.log("Returning invalid date:", invalidResult)
  return invalidResult
}

export class PatchAvailabilityItemDto {
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: "Date must be a valid date string (e.g., YYYY-MM-DD)" })
  @Type(() => Date)
  date!: Date

  @Transform(({ value }) => parseTimeString(value))
  @IsDate({ message: "start_time must be a valid time string (e.g., HH:mm)" })
  start_time!: Date

  @IsIn(["add", "delete"])
  update_type!: "add" | "delete"
}

export class PatchAvailabilityDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatchAvailabilityItemDto)
  items!: PatchAvailabilityItemDto[]
}
