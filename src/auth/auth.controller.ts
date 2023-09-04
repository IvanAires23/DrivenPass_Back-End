import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignUpDto } from './dto/signUp.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dtp';
import { Public } from '../decorator/public.decorator';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('sign-up')
    @ApiBody({ type: SignUpDto })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'created user' })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: 'repeated email' })
    signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto)
    }

    @Post('sign-in')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: SignInDto })
    @ApiResponse({ status: HttpStatus.OK, description: 'logged in user' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'incorret datas' })
    signIn(@Body() signIn: SignInDto) {
        return this.authService.signIn(signIn)
    }
}
