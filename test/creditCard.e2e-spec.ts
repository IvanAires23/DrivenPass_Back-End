import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { AuthService } from "../src/auth/auth.service";
import { UserService } from "../src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "../src/user/user.repository";
import { PrismaService } from "../src/prisma/prisma.service";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { E2EUtils } from "./utils/e2e-utils";
import request from 'supertest'
import { UserFactory } from "./fatories/users.fatory";
import { faker } from "@faker-js/faker";
import { CardsFactory } from "./fatories/creditCard.factory";

let app: INestApplication;
let prisma: PrismaService = new PrismaService()
let jwt: JwtService = new JwtService({ secret: process.env.JWT_SECRET })

beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
        providers: [AuthService, UserService, JwtService, UserRepository],
    })
        .overrideProvider(PrismaService)
        .useValue(prisma)
        .compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()

    await E2EUtils.cleanDB(prisma)
});

afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
});

describe('POST /cards', () => {
    it('should return 401 when not sending token', async () => {
        const response = await request(app.getHttpServer()).post('/cards')

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    });

    it('should return 401 when token is not valid', async () => {
        await new UserFactory(prisma).persist()
        const token = faker.word.words()

        const response = await request(app.getHttpServer())
            .post('/cards')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    });

});


describe('token is valid', () => {
    it('should return 400 when not sending complete data', async () => {
        const user = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)

        const response = await request(app.getHttpServer())
            .post('/cards')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.BAD_REQUEST)
        expect(response.body.message).toEqual([
            "title should not be empty",
            "title must be a string",
            "cardNumber must be longer than or equal to 4 characters",
            "cardNumber should not be empty",
            "cardNumber must be a string",
            "nameOnCard should not be empty",
            "nameOnCard must be a string",
            "cvv must be longer than or equal to 3 characters",
            "cvv should not be empty",
            "cvv must be a string",
            "dateExpiration must be a valid ISO 8601 date string",
            "dateExpiration should not be empty",
            "dateExpiration must be a string",
            "password should not be empty",
            "password must be a string",
            "isVirtual should not be empty",
            "isVirtual must be a boolean value",
            "type should not be empty",
            "type must be a string"
        ])
    });

    it('should return 409 when title is in use', async () => {
        const title = faker.word.words()
        const user = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        await new CardsFactory(prisma, user.id).withTitle(title).persist()
        const card = new CardsFactory(prisma, user.id).withTitle(title).build()
        const response = await request(app.getHttpServer())
            .post('/cards')
            .set('Authorization', `Bearer ${token}`)
            .send(card)

        expect(response.status).toBe(HttpStatus.CONFLICT)
    });

    it('should return 201 when create card', async () => {
        const user = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        const card = new CardsFactory(prisma, user.id).build()

        const response = await request(app.getHttpServer())
            .post('/cards')
            .set('Authorization', `Bearer ${token}`)
            .send(card)

        expect(response.status).toBe(HttpStatus.CREATED)
    })
})

describe('GET /cards', () => {
    it('should return 401 when not sending token', async () => {
        const response = await request(app.getHttpServer()).get('/cards')

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    });

    it('should return 401 when token is not valid', async () => {
        await new UserFactory(prisma).persist()
        const token = faker.word.words()

        const response = await request(app.getHttpServer())
            .get('/cards')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    });
})

describe('token is valid', () => {
    it('should return 403 when credit card is not the user', async () => {
        const user = await new UserFactory(prisma).persist()
        const newUser = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        const card = await new CardsFactory(prisma, newUser.id).persist()

        const response = await request(app.getHttpServer())
            .get(`/cards/${card.id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.FORBIDDEN)

    });

    it('should return 404 when not finding credit card', async () => {
        const user = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        await new CardsFactory(prisma, user.id).persist()

        const response = await request(app.getHttpServer())
            .get(`/cards/1`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.NOT_FOUND)
    });

    it('should return 200 to get cards', async () => {
        const user = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        await new CardsFactory(prisma, user.id).persist()

        const response = await request(app.getHttpServer())
            .get('/cards')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.OK)
        expect(response.body).toHaveLength(1)
    });
});

describe('DELETE /cards', () => {
    it('should return 401 when not sending token', async () => {
        const response = await request(app.getHttpServer()).delete('/cards/1')

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    });

    it('should return 401 when token is not valid', async () => {
        await new UserFactory(prisma).persist()
        const token = faker.word.words()

        const response = await request(app.getHttpServer())
            .delete('/cards/1')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    });

});

describe('token is valid', () => {

    it('should return 403 when credit card is not the user', async () => {
        const user = await new UserFactory(prisma).persist()
        const newUser = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        const card = await new CardsFactory(prisma, newUser.id).persist()

        const response = await request(app.getHttpServer())
            .delete(`/cards/${card.id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.FORBIDDEN)

    });

    it('should return 404 when not finding credit card', async () => {
        const user = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        await new CardsFactory(prisma, user.id).persist()

        const response = await request(app.getHttpServer())
            .delete(`/cards/1`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.NOT_FOUND)
    });

    it('should return 200 to delete card', async () => {
        const user = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)

        const card = await new CardsFactory(prisma, user.id).persist()

        const response = await request(app.getHttpServer())
            .delete(`/cards/${card.id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.OK)
    });
})
