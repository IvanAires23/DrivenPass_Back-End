import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {

  constructor(
    private readonly repository: UserRepository,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto
    const registeredEmail = await this.findEmail(email)
    if (registeredEmail) throw new HttpException("email already registered", HttpStatus.CONFLICT)

    return await this.repository.create(createUserDto)
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findEmail(email: string) {
    return await this.repository.findEmail(email)
  }

  async findUserById(id: number) {
    const user = await this.repository.findById(id)
    if (!user) throw new NotFoundException()
    return user
  }

}
