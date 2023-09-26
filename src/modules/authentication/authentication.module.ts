import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersService } from '../users/users.service';
import { JwtService } from '../jwts/jwt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, UsersService, JwtService],
})
export class AuthenticationModule {}
