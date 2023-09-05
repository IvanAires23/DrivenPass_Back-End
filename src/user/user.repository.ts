import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { BcryptService } from "../crypto/bcrypt.service";

@Injectable()
export class UserRepository {


    constructor(private readonly prisma: PrismaService,
        private readonly bcrypt: BcryptService) { }

    create(userDto: CreateUserDto) {
        return this.prisma.user.create({
            data: {
                ...userDto,
                password: this.bcrypt.hash(userDto.password)
            }
        })
    }

    findEmail(email: string) {
        return this.prisma.user.findFirst({
            where: { email }
        })
    }

    findById(id: number) {
        return this.prisma.user.findFirst({
            where: { id }
        })
    }

}