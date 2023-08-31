import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignUpDto } from './dto/signUp.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dtp';
import { Public } from '../decorator/public.decorator';


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('sign-up')
    signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto)
    }

    @Public()
    @Post('sign-in')
    @HttpCode(HttpStatus.OK)
    signIn(@Body() signIn: SignInDto) {
        return this.authService.signIn(signIn)
    }
}
