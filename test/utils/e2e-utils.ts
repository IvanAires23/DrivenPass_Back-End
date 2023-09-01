import { User } from "@prisma/client";
import { PrismaService } from "../../src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

export class E2EUtils {
    static async cleanDB(prisma: PrismaService) {
        await prisma.credential.deleteMany()
        await prisma.creditCard.deleteMany()
        await prisma.note.deleteMany()
        await prisma.session.deleteMany()
        await prisma.user.deleteMany()
    }

    static async generateValidToken(JwtService: JwtService, user?: User) {
        const token = JwtService.sign({ id: user.id })
        return token
    }
}