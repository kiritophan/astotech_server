import { Body, Controller, Post, Res} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UsersService } from './../users/users.service';
import { AuthenticationDto } from './dto/authentication.dto';
import {Response} from 'express'
import { JwtService } from '../jwts/jwt.service';
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService, private readonly usersService: UsersService, private readonly jwt: JwtService) {}

  @Post()
  async memberAuthentication(@Body() authenticationDto: AuthenticationDto, @Res() res: Response) {
    try {
      let userDecode = this.jwt.verifyToken(authenticationDto.token);
      if(userDecode) {
        let serResUser = await this.usersService.findById(userDecode.id);
        if(serResUser.status) {
          if(userDecode.updateAt == serResUser.data.updateAt) {
            return res.status(200).json(serResUser);
          }
        }
      }
      return res.status(213).json({
        message: "Authen failed!"
      })
    }catch {
      return res.status(500).json({
        message: "Lỗi controller"
      })
    }
  }
}
