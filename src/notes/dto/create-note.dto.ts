import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateNoteDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Day 1',
        description: 'title for note'
    })
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'note'
    })
    note: string;
}
