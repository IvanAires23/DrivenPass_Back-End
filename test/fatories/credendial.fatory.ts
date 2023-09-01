import { PrismaService } from "../../src/prisma/prisma.service";

export class CredentialFactory {
    private url: string;
    private username: string;
    private password: string;

    constructor(private readonly prisma: PrismaService, userId: number) { }

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

    build() {
        return {
            url: this.url,
            username: this.username,
            password: this.password
        }
    }

}