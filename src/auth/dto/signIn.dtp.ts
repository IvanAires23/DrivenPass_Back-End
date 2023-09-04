import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        example: 'example@example.com',
        description: 'user email'
    })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Str0ngP@ssw0rd',
        description: 'user password'
    })
    password: string
} 