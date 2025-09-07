import { IsString, IsIn, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PatchAvailabilityItemDto {
  @IsString()
  date!: string;

  @IsString()
  start_time!: string;

  @IsIn(['add', 'delete'])
  update_type!: 'add' | 'delete';
}

export class PatchAvailabilityDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatchAvailabilityItemDto)
  items!: PatchAvailabilityItemDto[];
}
