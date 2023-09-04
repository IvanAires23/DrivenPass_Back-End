import { faker } from "@faker-js/faker";
import { PrismaService } from "../../src/prisma/prisma.service";
import Cryptr from 'cryptr'

export class CardsFactory {

    private cardNumber: string;
    private nameInCard: string;
    private cvv: string;
    private dateOfExpiration: string
    private isVirtual: boolean;
    private password: string;
    private type: string
    private title: string
    private cryptr: Cryptr
    private randomCreditCard = faker.finance.accountNumber(4);
    private randomCvv = faker.finance.accountNumber(3)

    constructor(private readonly prisma: PrismaService, private readonly userId: number) {
        this.cryptr = new Cryptr(process.env.PASSWORD_CRYPTR);
    }

    withCardNumber(cardNumber: string) {
        this.cardNumber = cardNumber
        return this
    }

    withNameInCard(nameInCard: string) {
        this.nameInCard = nameInCard;
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

    withCvv(cvv: string) {
        this.cvv = cvv
        return this
    }

    withDateOfExpiration(dateOfExpiration: string) {
        this.dateOfExpiration = dateOfExpiration;
        return this
    }

    withIsVirtual(isVirtual: boolean) {
        this.isVirtual = isVirtual
        return this
    }

    withType(type: string) {
        this.type = type
        return this
    }

    build() {
        return {
            title: this.title || faker.word.words(),
            cardNumber: this.cardNumber || this.randomCreditCard,
            nameOnCard: this.nameInCard || faker.person.firstName(),
            cvv: this.cvv || this.randomCvv,
            dateExpiration: this.dateOfExpiration || faker.date.future(),
            password: this.password || this.cryptr.encrypt(this.randomCreditCard),
            isVirtual: this.isVirtual || faker.datatype.boolean(),
            type: this.type || "CREDIT"
        }
    }

    persist() {
        return this.prisma.creditCard.create({
            data: {
                title: this.title || faker.word.words(),
                numberCard: this.cardNumber || this.randomCreditCard,
                nameOnCard: this.nameInCard || faker.person.firstName(),
                cvv: this.cvv || this.randomCvv,
                expirationDate: this.dateOfExpiration || faker.date.future(),
                cardPassword: this.password || this.cryptr.encrypt(this.randomCreditCard),
                isVirtual: this.isVirtual || faker.datatype.boolean(),
                type: this.type || "CREDIT",
                userId: this.userId
            }
        })
    }

}