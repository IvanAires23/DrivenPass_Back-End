import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class EraseDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Str0ngP@ssw0rd',
        description: 'user password'
    })
    password: string
}