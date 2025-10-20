import { ApiProperty } from "@nestjs/swagger";
import { HoroscopeSector } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { IsEnum, IsString, Length, Matches} from "class-validator";

export class CreateCourseBodyDto {
    @ApiProperty()
    @IsString()
    @Length(16)
    id !: string;

    @ApiProperty()
    @IsString()
    @Length(16)
    prophetId !: string;

    @ApiProperty()
    @IsString()
    @Length(1, 50)
    courseName !: string;

    @ApiProperty()
    horoscopeMethodId !: number;

    @ApiProperty()
    @IsEnum(HoroscopeSector)
    horoscopeSector !: HoroscopeSector;

    @ApiProperty()
    durationMin !: number;

    @ApiProperty()
    @Matches(/^\d+(\.\d{1,2})?$/, { message: 'Price can have up to 2 decimal places only' })
    price !: Decimal;

    @ApiProperty()
    isActive !: boolean;
}