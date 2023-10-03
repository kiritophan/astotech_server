import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { FindByIdSerRes, RegisterSerRes, UpdateSerRes } from './users.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import validation from '../../utils/validation'
@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private users: Repository<User>) { }

  async create(createUserDto: CreateUserDto) {
    try {
      let newUser = this.users.create(createUserDto)
      let results = await this.users.save(newUser);
      return {
        status: true,
        message: "Create user successfully",
        data: newUser
      };
    } catch (err) {
      return {
        status: false,
        message: err.sqlMessage,
        data: null
      }
    }

  }

  async register(createUserDto: CreateUserDto): Promise<RegisterSerRes> {
    try {
      let newUser = this.users.create(createUserDto);
      let result = await this.users.save(newUser);
      return {
        status: true,
        data: result,
        message: "Register ok!"
      }
    } catch (err) {
      return {
        status: false,
        data: null,
        message: "Lỗi model"
      }
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<UpdateSerRes> {
    try {
      let userSource = await this.users.findOne({
        where: {
          id: userId
        }
      })

      let userSourceUpdate = this.users.merge(userSource, updateUserDto);
      let result = await this.users.save(userSourceUpdate);
      return {
        status: true,
        data: result,
        message: "Update ok!"
      }
    } catch (err) {
      return {
        status: false,
        data: null,
        message: "Lỗi model"
      }
    }
  }

  async findById(userId: string): Promise<FindByIdSerRes> {
    try {
      let result = await this.users.findOne({
        where: {
          id: userId
        }
      });

      if (!result) {
        throw new Error
      }

      return {
        status: true,
        data: result,
        message: "Find user by id ok!"
      }
    } catch (err) {
      return {
        status: false,
        data: null,
        message: "Lỗi model"
      }
    }
  }

  async findByEmailOrUserName(emailOrUserName: string): Promise<FindByIdSerRes> {
    try {
      let result = await this.users.findOne({
        where: validation.isEmail(emailOrUserName)
          ? {
            email: emailOrUserName,
            emailAuthentication: true
          }
          : {
            userName: emailOrUserName
          }
      });

      if (!result) {
        throw new Error
      }

      return {
        status: true,
        data: result,
        message: "Find user ok!"
      }
    } catch (err) {
      return {
        status: false,
        data: null,
        message: "Lỗi model"
      }
    }
  }

  async findByUserEmail(email: string): Promise<FindByIdSerRes> {
    try {
      let result = await this.users.findOne({
        where: {
          email
        }
      });

      if (!result) {
        throw new Error
      }

      return {
        status: true,
        data: result,
        message: "Find user ok!"
      }
    } catch (err) {
      return {
        status: false,
        data: null,
        message: "Lỗi model"
      }
    }
  }
}
