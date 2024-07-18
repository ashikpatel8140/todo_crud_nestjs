import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserAuthGuard } from './guards/auth.guard';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
    secret: new Buffer(process.env.jwt_secret, 'base64'),
    signOptions: { algorithm: 'HS512' },
  })],
  exports: [UserAuthGuard],
  controllers: [AuthController],
  providers: [AuthService, UserAuthGuard],
})
export class AuthModule {}
