import { PrismaService } from "../../src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

export class E2EUtils {

    static async cleanDB(prisma: PrismaService) {
        await prisma.credential.deleteMany()
        await prisma.creditCard.deleteMany()
        await prisma.note.deleteMany()
        await prisma.user.deleteMany()
    }

    static async generateValidToken(JwtService: JwtService, id: number) {
        const token = JwtService.sign({ id })
        return token
    }

}