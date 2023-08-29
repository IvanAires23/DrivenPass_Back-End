import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET
  })],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule { }
