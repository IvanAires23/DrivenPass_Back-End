import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common"
import { PrismaService } from "../src/prisma/prisma.service";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { E2EUtils } from "./utils/e2e-utils";
import { JwtService } from "@nestjs/jwt";
import { UserFactory } from "./fatories/users.fatory";
import request from 'supertest'
import { AuthService } from "../src/auth/auth.service";
import { UserService } from "../src/user/user.service";
import { UserRepository } from "../src/user/user.repository";
import { CredentialFactory } from "./fatories/credendial.fatory";
import { faker } from "@faker-js/faker";

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

describe('POST /credentials', () => {
    it('should return 401 when not sending token', async () => {
        const response = await request(app.getHttpServer()).post('/credentials')

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    });

    it('should return 401 when token is not valid', async () => {
        await new UserFactory(prisma).persist()
        const token = faker.word.words()

        const response = await request(app.getHttpServer())
            .post('/credentials')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    });
});

describe('token is valid', () => {

    it('it should return 409 when the credential already exists', async () => {
        const user = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        await new CredentialFactory(prisma, user.id)
            .withTitle('test')
            .persist()

        const credential = new CredentialFactory(prisma, user.id)
            .withPassword('5tr0ngP@ssW0rd')
            .withTitle('test')
            .withUrl(faker.internet.url())
            .withUsername(faker.person.firstName())
            .build()

        const response = await request(app.getHttpServer())
            .post('/credentials')
            .set('Authorization', `Bearer ${token}`)
            .send(credential)

        expect(response.status).toBe(HttpStatus.CONFLICT)
    });

    it('should return 201 when creating a credential', async () => {
        const user = await new UserFactory(prisma)
            .withEmail("test@test.com")
            .withPassword("Str0ngP@ssw0rd")
            .persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)

        const credential = new CredentialFactory(prisma, user.id)
            .withUrl(faker.internet.url())
            .withUsername(faker.person.firstName())
            .withPassword("Str0ngP@ssw0rd")
            .withTitle(faker.company.buzzAdjective())
            .build()

        const response = await request(app.getHttpServer())
            .post('/credentials')
            .set('Authorization', `Bearer ${token}`)
            .send(credential)

        expect(response.status).toBe(HttpStatus.CREATED)
    });
})

describe('GET /credentials', () => {
    it('should return 401 when not sending token', async () => {
        const response = await request(app.getHttpServer()).get('/credentials')

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    });

    it('should return 401 when token is not valid', async () => {
        await new UserFactory(prisma).persist()
        const token = faker.word.words()

        const response = await request(app.getHttpServer())
            .get('/credentials')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    });
})

describe('token is valid', () => {
    it('should return 403 when credential is not the user', async () => {
        const user = await new UserFactory(prisma).persist()
        const newUser = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        const credendial = await new CredentialFactory(prisma, newUser.id).persist()

        const response = await request(app.getHttpServer())
            .get(`/credentials/${credendial.id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.FORBIDDEN)

    });

    it('should return 404 when not finding credential', async () => {
        const user = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        await new CredentialFactory(prisma, user.id).persist()

        const response = await request(app.getHttpServer())
            .get(`/credentials/1`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.NOT_FOUND)
    });

    it('should return 200 to get credentials', async () => {
        const user = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        await new CredentialFactory(prisma, user.id).persist()

        const response = await request(app.getHttpServer())
            .get('/credentials')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.OK)
        expect(response.body).toHaveLength(1)
    });

    it('should return 200 to delete credential', async () => {
        const user = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)

        const credendial = await new CredentialFactory(prisma, user.id).persist()

        const response = await request(app.getHttpServer())
            .delete(`/credentials/${credendial.id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.OK)
    });
})

describe('DELETE /credentials', () => {
    it('should return 401 when not sending token', async () => {
        const response = await request(app.getHttpServer()).delete('/credentials/1')

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    });

    it('should return 401 when token is not valid', async () => {
        await new UserFactory(prisma).persist()
        const token = faker.word.words()

        const response = await request(app.getHttpServer())
            .delete('/credentials/1')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    });
})

describe('token is valid', () => {
    it('should return 404 if delete credential not exist', async () => {
        const user = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        await new CredentialFactory(prisma, user.id).persist()

        const response = await request(app.getHttpServer())
            .delete(`/credentials/1`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.NOT_FOUND)
    });

    it('should return 403 when deleting credential that is not yours', async () => {
        const user = await new UserFactory(prisma).persist()
        const newUser = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        const credendial = await new CredentialFactory(prisma, newUser.id).persist()

        const response = await request(app.getHttpServer())
            .delete(`/credentials/${credendial.id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.FORBIDDEN)
    });
})