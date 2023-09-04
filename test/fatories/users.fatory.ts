import * as bcrypt from 'bcrypt'
import { PrismaService } from "../../src/prisma/prisma.service";
import { faker } from '@faker-js/faker';

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
        return this.prisma.user.create({
            data: {
                email: this.email ? this.email : faker.internet.email(),
                password: bcrypt.hashSync('Str0ngP@ssw0rd', 10)
            }
        })
    }
}

