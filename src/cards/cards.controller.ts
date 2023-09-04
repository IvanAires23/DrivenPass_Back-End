import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../decorator/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('CreditCards')
@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) { }

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateCardDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'all very well' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'repeated title' })
  create(@Body() createCardDto: CreateCardDto, @User() user: UserPrisma) {
    return this.cardsService.create(createCardDto, user.id);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, description: 'all very well' })
  findAll(@User() user: UserPrisma) {
    return this.cardsService.findAll(user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'credit card id',
    example: 1
  })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, description: 'all very well' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'credit card id is not user' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'credit card not found' })
  findOne(@Param('id') id: string, @User() user: UserPrisma) {
    return this.cardsService.findOne(+id, user.id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'credit card id',
    example: 1
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'all very well' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'credit card id is not user' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'credit card not found' })
  remove(@Param('id') id: string, @User() user: UserPrisma) {
    return this.cardsService.remove(+id, user.id);
  }
}
