import { ApiProperty } from "@nestjs/swagger";
import { EQUALS, Equals, IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsNumberString, IsString, Length, equals } from "class-validator";

export class CreateCardDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Nubank',
        description: 'card name'
    })
    title: string

    @IsString()
    @IsNotEmpty()
    @Length(4)
    @ApiProperty({
        example: '1234',
        description: '4 last number of card'
    })
    number: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Ivan Aires',
        description: 'name on card'
    })
    nameOnCard: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 3)
    @ApiProperty({
        example: '123'
    })
    cvv: string;

    @IsString()
    @IsNotEmpty()
    @IsDateString()
    @ApiProperty({
        example: '2022-11-19T05:52:49.100Z'
    })
    expirationDate: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '1234',
        description: 'password card'
    })
    password: string;

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({
        example: true
    })
    isVirtual: boolean;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'CREDIT',
        description: 'CREDIT, DEBIT, CREDITDEBIT'
    })
    type: string
}
