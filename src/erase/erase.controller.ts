import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EraseService } from './erase.service';
import { AuthGuard } from '../auth/auth.guard';
import { EraseDto } from './dto/erase.dto';
import { User } from '../decorator/user.decorator';
import { User as UserPrisma } from '@prisma/client';

@Controller('erase')
export class EraseController {

    constructor(private readonly eraseService: EraseService) { }

    @Post()
    @UseGuards(AuthGuard)
    erase(@Body() body: EraseDto, @User() user: UserPrisma) {
        return this.eraseService.deleteUser(body, user.id)
    }
}
