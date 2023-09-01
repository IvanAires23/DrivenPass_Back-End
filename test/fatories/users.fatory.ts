import * as bcrypt from 'bcrypt'
import { PrismaService } from "../../src/prisma/prisma.service";

export class UserFactory {

    private salt = 10
    private email: string;
    private password: string;

    constructor(private readonly prisma: PrismaService) { }

    withEmail(email: string) {
        this.email = email
        return this
    }

    withPassword(password: string) {
        this.password = password
        return this
    }

    build() {
        return {
            email: this.email,
            password: this.password
        }
    }

    persist() {
        const user = this.build()
        return this.prisma.user.create({
            data: {
                email: this.email,
                password: bcrypt.hashSync(this.password, 10)
            }
        })
    }
}

