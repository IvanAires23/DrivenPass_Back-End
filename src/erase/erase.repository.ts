import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class EraseRepository {

    constructor(private readonly prisma: PrismaService) { }

    async deleteUser(userId: number) {
        await this.prisma.credential.deleteMany()
        await this.prisma.creditCard.deleteMany()
        await this.prisma.note.deleteMany()
        await this.prisma.user.deleteMany({ where: { id: userId } })
        return 'User delete'
    }


}