import { ConflictException, ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { CredentialRepository } from './crendential.repository';
import { User } from '@prisma/client';
import Cryptr from 'cryptr';
import { CryptrService } from '../crypto/cryptr.service';

@Injectable()
export class CredentialService {

  constructor(
    private readonly repository: CredentialRepository,
    private readonly cryptrService: CryptrService
  ) { }

  async create(crendentialDto: CreateCredentialDto, user: User) {
    const { password, title, url, username } = crendentialDto
    const titleAndUser = await this.repository.findByTitleAndUser(title, user.id)
    if (titleAndUser) throw new ConflictException('Title already in use')

    const cryptrPassword = this.cryptrService.encrypt(password)

    return await this.repository.createCredential(title, cryptrPassword, url, username, user.id)
  }

  async findAll(userId: number) {
    const credential = await this.repository.findAll(userId);
    const credentialsUser = []
    for (let i = 0; i < credential.length; i++) {
      const decryptPassword = this.cryptrService.decrypt(credential[i].password)
      credential[i].password = decryptPassword
      credentialsUser.push(credential[i])
    }
    return credentialsUser
  }

  async findOne(id: number, userId: number) {
    const credential = await this.repository.findOne(id)
    if (!credential) throw new NotFoundException('Not Found credential')
    if (credential.userId !== userId) throw new ForbiddenException()
    credential.password = this.cryptrService.decrypt(credential.password)

    return credential
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId)
    return await this.repository.delete(id)
  }
}
