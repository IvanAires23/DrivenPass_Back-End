import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { EraseService } from './erase.service';
import { AuthGuard } from '../auth/auth.guard';
import { EraseDto } from './dto/erase.dto';
import { User } from '../decorator/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Delete user')
@Controller('erase')
export class EraseController {

    constructor(private readonly eraseService: EraseService) { }

    @Post()
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiBody({ type: EraseDto })
    @ApiResponse({ status: HttpStatus.OK, description: 'all very well' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'incorret password' })
    erase(@Body() body: EraseDto, @User() user: UserPrisma) {
        return this.eraseService.deleteUser(body, user.id)
    }
}
