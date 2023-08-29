import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from "bcrypt"
import { UserLoginDto } from './dto/user-login.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {

  private salt = 10

  constructor(
    private readonly repository: UserRepository,
    private readonly authService: AuthService
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto
    const registeredEmail = await this.findEmail(email)
    if (registeredEmail) throw new HttpException("email already registered", HttpStatus.CONFLICT)

    const hash = this.hashPassword(password)
    return await this.repository.create(email, hash)
  }

  async createOne(dto: UserLoginDto) {
    const { email, password } = dto

    const login = await this.findEmail(email)
    if (!login) throw new HttpException('Incorrect email', HttpStatus.UNAUTHORIZED)

    this.comparePassword(password, login.password)
    const token = await this.authService.generateToken(login)

    return await this.repository.createSession(token, login.id)
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private async findEmail(email: string) {
    return await this.repository.findEmail(email)
  }

  private hashPassword(password: string) {
    return bcrypt.hashSync(password, this.salt)
  }

  private comparePassword(password: string, passwordCrypt: string) {
    const compare = bcrypt.compareSync(password, passwordCrypt)
    if (!compare) throw new HttpException('Incorret password', HttpStatus.UNAUTHORIZED)
  }
}
