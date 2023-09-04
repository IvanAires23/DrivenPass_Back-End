import { faker } from "@faker-js/faker";
import { PrismaService } from "../../src/prisma/prisma.service";

export class NotesFactory {

    private title: string;
    private note: string

    constructor(private readonly prisma: PrismaService, private readonly userId: number) { }

    withTitle(title: string) {
        this.title = title
        return this
    }

    withNote(note: string) {
        this.note = note
        return this
    }

    build() {
        return {
            note: this.note || faker.word.words(5),
            title: this.title || faker.word.words()
        }
    }

    persist() {
        return this.prisma.note.create({
            data: {
                note: this.note || faker.word.words(5),
                title: this.title || faker.word.words(),
                userId: this.userId
            }
        })
    }
}