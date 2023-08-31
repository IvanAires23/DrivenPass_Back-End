import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class EraseRepository {

    constructor(private readonly prisma: PrismaService) { }

    deleteUser(userId: number) {
        this.prisma.credential.deleteMany({ where: { userId } })
        this.prisma.note.deleteMany({ where: { userId } })
        this.prisma.creditCard.deleteMany({ where: { userId } })
        this.prisma.session.deleteMany({ where: { userId } })
        return this.prisma.user.delete({ where: { id: userId } })
    }


}