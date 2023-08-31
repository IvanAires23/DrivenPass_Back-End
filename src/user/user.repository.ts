import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt"

@Injectable()
export class UserRepository {

    private salt = 10

    constructor(private readonly prisma: PrismaService) { }

    create(userDto: CreateUserDto) {
        return this.prisma.user.create({
            data: {
                ...userDto,
                password: bcrypt.hashSync(userDto.password, this.salt)
            }
        })
    }

    createSession(token: string, id: number) {
        return this.prisma.session.create({
            data: {
                token,
                userId: id
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