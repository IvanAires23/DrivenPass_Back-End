import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { CryptoModule } from '../crypto/crypto.module';

@Global()
@Module({
  providers: [UserService, UserRepository],
  exports: [UserService]
})
export class UserModule { }
