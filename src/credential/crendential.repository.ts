import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CredentialRepository {

    constructor(private readonly prisma: PrismaService) { }

    createCredential(title: string, password: string, url: string, username: string, id: number) {
        return this.prisma.credential.create({
            data: {
                title,
                url,
                username,
                password,
                userId: id
            }
        })
    }

    findAll(userId: number) {
        return this.prisma.credential.findMany({
            where: { userId }
        })
    }

    findOne(id: number) {
        return this.prisma.credential.findFirst({
            where: {
                id
            }
        })
    }

    findByTitleAndUser(title: string, id: number) {
        return this.prisma.credential.findUnique({
            where: {
                userId_title: {
                    title,
                    userId: id
                }
            }
        })
    }

    delete(id: number) {
        return this.prisma.credential.delete({
            where: {
                id
            }
        })
    }
}