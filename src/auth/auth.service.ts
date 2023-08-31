import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signUp.dto';
import { UserService } from '../user/user.service';
import { SignInDto } from './dto/signIn.dtp';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }

    async signUp(body: SignUpDto) {
        return await this.userService.create(body)
    }

    async signIn(body: SignInDto) {
        const { email, password } = body
        const user = await this.userService.findEmail(email)
        if (!user) throw new UnauthorizedException("Incorret email")

        const compare = await bcrypt.compare(password, user.password)
        if (!compare) throw new UnauthorizedException("Password incorret")

        return this.generateToken(user.id)

    }

    verifyToken(token: string) {
        const data = this.jwtService.verify(token)
        return data
    }

    generateToken(id: number) {
        const token = this.jwtService.sign({ id })
        return { token }
    }
}
