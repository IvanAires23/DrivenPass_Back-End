import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from '../user/dto/user-login.dto';
import { TokenDto } from './dto/auth.dto';

@Injectable()
export class AuthService {

    constructor(private readonly JwtService: JwtService) { }

    async generateToken(dto: TokenDto) {
        return this.JwtService.sign(dto)
    }
}
