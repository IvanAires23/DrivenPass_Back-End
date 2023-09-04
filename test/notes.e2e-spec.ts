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

describe('POST /notes', () => {
    it('should return 401 when not sending token', async () => {
        const response = await request(app.getHttpServer()).post('/notes')

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    });

    it('should return 401 when token is not valid', async () => {
        await new UserFactory(prisma).persist()
        const token = faker.word.words()

        const response = await request(app.getHttpServer())
            .post('/notes')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    });

});


describe('token is valid', () => {
    it('should return 400 when not sending complete data', async () => {
        const user = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)

        const response = await request(app.getHttpServer())
            .post('/notes')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.BAD_REQUEST)
        expect(response.body.message).toEqual([
            "title should not be empty",
            "title must be a string",
            "note should not be empty",
            "note must be a string"
        ])
    });

    it('should return 409 when title is in use', async () => {
        const title = faker.word.words()
        const user = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        await new NotesFactory(prisma, user.id).withTitle(title).persist()
        const note = new NotesFactory(prisma, user.id).withTitle(title).build()

        const response = await request(app.getHttpServer())
            .post('/notes')
            .set('Authorization', `Bearer ${token}`)
            .send(note)

        expect(response.status).toBe(HttpStatus.CONFLICT)
    });

    it('should return 201 when create note', async () => {
        const user = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        const note = new NotesFactory(prisma, user.id).build()

        const response = await request(app.getHttpServer())
            .post('/notes')
            .set('Authorization', `Bearer ${token}`)
            .send(note)

        expect(response.status).toBe(HttpStatus.CREATED)
        expect(response.body).toEqual({
            id: expect.any(Number),
            title: note.title,
            note: note.note,
            userId: expect.any(Number)
        })
    })
})

describe('GET /notes', () => {
    it('should return 401 when not sending token', async () => {
        const response = await request(app.getHttpServer()).post('/notes')

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    });

    it('should return 401 when token is not valid', async () => {
        await new UserFactory(prisma).persist()
        const token = faker.word.words()

        const response = await request(app.getHttpServer())
            .post('/notes')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    });
})

describe('token is valid', () => {
    it('should return 403 when credential is not the user', async () => {
        const user = await new UserFactory(prisma).persist()
        const newUser = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        const note = await new NotesFactory(prisma, newUser.id).persist()

        const response = await request(app.getHttpServer())
            .get(`/notes/${note.id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.FORBIDDEN)

    });

    it('should return 404 when not finding credential', async () => {
        const user = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        await new NotesFactory(prisma, user.id).persist()

        const response = await request(app.getHttpServer())
            .get(`/notes/1`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.NOT_FOUND)
    });

    it('should return 200 to get notes', async () => {
        const user = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        await new NotesFactory(prisma, user.id).persist()

        const response = await request(app.getHttpServer())
            .get('/notes')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.OK)
        expect(response.body).toHaveLength(1)
    });
});

describe('DELETE /notes', () => {
    it('should return 401 when not sending token', async () => {
        const response = await request(app.getHttpServer()).post('/notes')

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    });

    it('should return 401 when token is not valid', async () => {
        await new UserFactory(prisma).persist()
        const token = faker.word.words()

        const response = await request(app.getHttpServer())
            .post('/notes')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    });

});

describe('token is valid', () => {

    it('should return 403 when credential is not the user', async () => {
        const user = await new UserFactory(prisma).persist()
        const newUser = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        const note = await new NotesFactory(prisma, newUser.id).persist()

        const response = await request(app.getHttpServer())
            .delete(`/notes/${note.id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.FORBIDDEN)

    });

    it('should return 404 when not finding credential', async () => {
        const user = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)
        await new NotesFactory(prisma, user.id).persist()

        const response = await request(app.getHttpServer())
            .delete(`/notes/1`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.NOT_FOUND)
    });

    it('should return 200 to delete note', async () => {
        const user = await new UserFactory(prisma).persist()
        const token = await E2EUtils.generateValidToken(jwt, user.id)

        const note = await new NotesFactory(prisma, user.id).persist()

        const response = await request(app.getHttpServer())
            .delete(`/notes/${note.id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(HttpStatus.OK)
    });
})
