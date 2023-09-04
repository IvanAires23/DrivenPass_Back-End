import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        example: 'example@example.com',
        description: 'email for user'
    })
    email: string;

    @IsString()
    @IsStrongPassword({
        minLength: 10,
        minNumbers: 1,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1
    })
    @IsNotEmpty()
    @ApiProperty({
        example: 'Str0ngP@ssw0rd',
        description: 'password for user'
    })
    password: string
}
