import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCardDto } from "./dto/create-card.dto";

@Injectable()
export class CardsRepository {

    constructor(private readonly prisma: PrismaService) { }

    createCreditCard(data: CreateCardDto, userId: number) {
        return this.prisma.creditCard.create({ data: { ...data, userId } })
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
