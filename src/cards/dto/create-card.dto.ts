import { EQUALS, Equals, IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsNumberString, IsString, Length, equals } from "class-validator";

export class CreateCardDto {

    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    @Length(4)
    cardNumber: string;

    @IsString()
    @IsNotEmpty()
    nameOnCard: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 3)
    cvv: string;

    @IsString()
    @IsNotEmpty()
    @IsDateString()
    dateExpiration: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsBoolean()
    @IsNotEmpty()
    isVirtual: boolean;

    @IsString()
    @IsNotEmpty()
    type: string
}
