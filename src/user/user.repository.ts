import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserRepository {

    constructor(private readonly prisma: PrismaService) { }

    create(email: string, password: string) {
        return this.prisma.user.create({
            data: {
                email,
                password
            }
        })
    }

    createSession(token: string, id: number) {
        return this.prisma.sessions.create({
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
}