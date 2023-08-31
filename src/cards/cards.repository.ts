import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CardsRepository {

    constructor(private readonly prisma: PrismaService) { }

    createCreditCard(title: string, cryptCvv: string, cryptPassword: string, numberCard: string, expirationDate: string, isVirtual: boolean, nameOnCard: string, type: string, userId: number) {
        return this.prisma.creditCard.create({
            data: {
                cardPassword: cryptPassword,
                cvv: cryptCvv,
                expirationDate,
                isVirtual,
                nameOnCard,
                numberCard,
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