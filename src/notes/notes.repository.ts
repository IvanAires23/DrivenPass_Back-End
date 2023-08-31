import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateNoteDto } from "./dto/create-note.dto";

@Injectable()
export class NotesRepository {

    constructor(private readonly prisma: PrismaService) { }

    createNotes(createNoteDto: CreateNoteDto, userId: number) {
        return this.prisma.note.create({
            data: {
                note: createNoteDto.note,
                title: createNoteDto.title,
                userId
            }
        })
    }

    findAll(userId: number) {
        return this.prisma.note.findMany({
            where: { userId }
        })
    }

    findOne(id: number) {
        return this.prisma.note.findFirst({
            where: { id }
        })
    }

    findByTitleAndUser(title: string, userId: number) {
        return this.prisma.note.findUnique({
            where: {
                userId_title: {
                    title,
                    userId
                }
            }
        })
    }

    delete(id: number) {
        return this.prisma.note.delete({
            where: { id }
        })
    }

}