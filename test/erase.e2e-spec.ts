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
import { NotesFactory } from "./fatories/notes.factory";



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

describe('POST /erase', () => {
    it('should return 401 when not sending token', async () => {
        const response = await request(app.getHttpServer()).post('/erase')

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    });

    it('should return 401 when token is not valid', async () => {
        await new UserFactory(prisma).persist()
        const token = faker.word.words()

        const response = await request(app.getHttpServer())
            .post('/erase')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    });
});

describe('token is valid', () => {
    it('should return 401 when incorret password', async () => {
        const user = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        const body = { password: faker.word.words() }

        const response = await request(app.getHttpServer())
            .post('/erase')
            .set('Authorization', `Bearer ${token}`)
            .send(body)

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    });

    it('should return 200 when delete all datas of user', async () => {
        const user = await new UserFactory(prisma)
            .withPassword('Str0ngP@ssw0rd')
            .persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        const body = { password: 'Str0ngP@ssw0rd' }

        const response = await request(app.getHttpServer())
            .post('/erase')
            .set('Authorization', `Bearer ${token}`)
            .send(body)

        const creditCards = await prisma.creditCard.findMany()
        const credential = await prisma.credential.findMany()
        const notes = await prisma.note.findMany()
        const users = await prisma.user.findMany({ where: { id: user.id } })

        expect(credential).toHaveLength(0)
        expect(creditCards).toHaveLength(0)
        expect(notes).toHaveLength(0)
        expect(users).toHaveLength(0)
        expect(response.status).toBe(HttpStatus.OK)
    })
})