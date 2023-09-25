import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCardDto } from "./dto/create-card.dto";

@Injectable()
export class CardsRepository {

    constructor(private readonly prisma: PrismaService) { }

    createCreditCard(title: string, cryptCvv: string, cryptPassword: string, number: string, expirationDate: string, isVirtual: boolean, nameOnCard: string, type: string, userId: number) {
        return this.prisma.creditCard.create({
            data: {
                password: cryptPassword,
                cvv: cryptCvv,
                expirationDate,
                isVirtual,
                nameOnCard,
                number,
                title,
                type,
                userId
            }
        })
    }

    findAll(userId: number) {
        return this.prisma.creditCard.findMany({
            where: { userId }
        })
    }

    findOne(id: number) {
        return this.prisma.creditCard.findFirst({
            where: { id }
        })
    }

    findByTitleAndUser(title: string, userId: number) {
        return this.prisma.creditCard.findUnique({
            where: {
                userId_title: {
                    userId,
                    title
                }
            }
        })
    }

    delete(id: number) {
        return this.prisma.creditCard.delete({
            where: { id }
        })
    }
}
