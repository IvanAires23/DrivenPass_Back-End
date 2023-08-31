import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { CredentialModule } from './credential/credential.module';
import { CryptrModule } from './cryptr/cryptr.module';

@Module({
  imports: [UserModule, PrismaModule, HealthModule, AuthModule, CredentialModule, CryptrModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
