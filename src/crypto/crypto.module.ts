import { Global, Module } from '@nestjs/common';
import { CryptrService } from './cryptr.service';
import { BcryptService } from './bcrypt.service';

@Global()
@Module({
  providers: [CryptrService, BcryptService],
  exports: [CryptrService, BcryptService]
})
export class CryptoModule { }
