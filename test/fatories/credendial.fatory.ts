import { faker } from "@faker-js/faker";
import { PrismaService } from "../../src/prisma/prisma.service";
import Cryptr from "cryptr";
import { CryptrService } from "../../src/crypto/cryptr.service";

export class CredentialFactory {
    private url: string;
    private username: string;
    private password: string;
    private title: string

    constructor(private readonly prisma: PrismaService,
        private readonly userId: number,
        private readonly crytpo: CryptrService) {
    }

    withUrl(url: string) {
        this.url = url
        return this
    }

    withUsername(username: string) {
        this.username = username;
        return this
    }

    withPassword(password: string) {
        this.password = password
        return this
    }

    withTitle(title: string) {
        this.title = title
        return this
    }

    build() {
        return {
            url: this.url || faker.internet.url(),
            username: this.username || faker.person.firstName(),
            password: this.password || faker.word.words(),
            title: this.title || faker.company.buzzAdjective()
        }
    }

    persist() {
        return this.prisma.credential.create({
            data: {
                url: this.url || faker.internet.url(),
                username: this.username || faker.person.firstName(),
                password: this.crytpo.encrypt('Str0ngP@ssw0rd'),
                title: this.title || faker.word.words(),
                userId: this.userId
            }
        })
    }

}