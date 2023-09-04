import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../decorator/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('notes')
@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) { }

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateNoteDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'all very well' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'repeated title' })
  create(@Body() createNoteDto: CreateNoteDto, @User() user: UserPrisma) {
    return this.notesService.create(createNoteDto, user.id);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, description: 'all very well' })
  findAll(@User() user: UserPrisma) {
    return this.notesService.findAll(user.id);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'note id',
    example: 1
  })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, description: 'all very well' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'note id is not user' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'note not found' })
  findOne(@Param('id') id: string, @User() user: UserPrisma) {
    return this.notesService.findOne(+id, user.id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'note id',
    example: 1
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'all very well' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'note id is not user' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'note not found' })
  remove(@Param('id') id: string, @User() user: UserPrisma) {
    return this.notesService.remove(+id, user.id);
  }
}
