import { Module } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CredentialController } from './credential.controller';
import { UserModule } from '../user/user.module';
import { CredentialRepository } from './crendential.repository';

@Module({
  imports: [UserModule],
  controllers: [CredentialController],
  providers: [CredentialService, CredentialRepository],
})
export class CredentialModule { }
