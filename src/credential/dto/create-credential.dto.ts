import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsStrongPassword, IsUrl } from "class-validator";

export class CreateCredentialDto {
    @IsString()
    @IsNotEmpty()
    @IsUrl()
    @ApiProperty({
        example: 'www.google.com'
    })
    url: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Ivan',
        description: 'user name in url'
    })
    username: string;

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 10,
        minNumbers: 1,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1
    })
    @ApiProperty({
        example: 'Str0ngP@ssw0rd',
        description: 'user password in url'
    })
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Google',
        description: 'title for url'
    })
    title: string;
}
