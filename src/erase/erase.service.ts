import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { EraseDto } from './dto/erase.dto';
import { EraseRepository } from './erase.repository';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class EraseService {

    constructor(
        private readonly repository: EraseRepository,
        private readonly userService: UserService
    ) { }

    async deleteUser(body: EraseDto, userId: number) {
        const user = await this.userService.findUserById(userId)
        if (!user) throw new NotFoundException('Not Found User')

        const compare = bcrypt.compare(body.password, user.password)
        if (!compare) throw new UnauthorizedException('Incorret password')

        return await this.repository.deleteUser(userId)
    }
}
