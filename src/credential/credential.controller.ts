import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../decorator/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Credentials')
@UseGuards(AuthGuard)
@Controller('credentials')
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) { }


  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateCredentialDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'all very well' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'repeated title' })
  create(@Body() createCredentialDto: CreateCredentialDto, @User() user: UserPrisma) {
    try {
      return this.credentialService.create(createCredentialDto, user);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.UNAUTHORIZED)
    }
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, description: 'all very well' })
  findAll(@User() user: UserPrisma) {
    return this.credentialService.findAll(user.id);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'credential id',
    example: 1
  })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, description: 'all very well' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'credential id is not user' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'credential not found' })
  findOne(@Param('id') id: string, @User() user: UserPrisma) {
    return this.credentialService.findOne(+id, user.id);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'credencial id',
    example: 1
  })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, description: 'all very well' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'credential id is not user' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'credential not found' })
  remove(@Param('id') id: string, @User() user: UserPrisma) {
    return this.credentialService.remove(+id, user.id);
  }
}
