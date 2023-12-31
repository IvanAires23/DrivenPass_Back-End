import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { CredentialModule } from './credential/credential.module';
import { NotesModule } from './notes/notes.module';
import { CardsModule } from './cards/cards.module';
import { EraseModule } from './erase/erase.module';
import { CryptoModule } from './crypto/crypto.module';

@Module({
  imports: [UserModule, PrismaModule, HealthModule, AuthModule, CredentialModule, NotesModule, CardsModule, EraseModule, CryptoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
