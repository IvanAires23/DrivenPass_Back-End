import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common"
import { PrismaService } from "../src/prisma/prisma.service";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { E2EUtils } from "./utils/e2e-utils";
import request from "supertest";
import { faker } from '@faker-js/faker'
import { CreateUserDto } from "../src/user/dto/create-user.dto";
import { UserFactory } from "./fatories/users.fatory";
import { UserLoginDto } from "../src/user/dto/user-login.dto";

describe('Users E2E test', () => {
    let app: INestApplication;
    let prisma: PrismaService = new PrismaService();

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
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

    it('should return 201 when creating account', async () => {
        const userDto: CreateUserDto = new UserFactory(prisma)
            .withEmail(faker.internet.email())
            .withPassword("Str0ngP@ssw0rd")
            .build()
        const response = await request(app.getHttpServer())
            .post('/auth/sign-up')
            .send(userDto)

        expect(response.status).toBe(HttpStatus.CREATED)
    })

    it('should return 200 when user login', async () => {
        await new UserFactory(prisma)
            .withEmail("test@test.com")
            .withPassword("Str0ngP@ssw0rd")
            .persist()

        const user: UserLoginDto = new UserFactory(prisma)
            .withEmail("test@test.com")
            .withPassword("Str0ngP@ssw0rd")
            .build()

        const response = await request(app.getHttpServer())
            .post('/auth/sign-in')
            .send(user)

        expect(response.status).toBe(HttpStatus.OK)
        expect(response.body).toEqual({
            token: expect.any(String)
        })
    })

    it('should return 409 when email repeat', async () => {
        await new UserFactory(prisma)
            .withEmail("test@test.com")
            .withPassword("Str0ngP@ssw0rd")
            .persist()

        const userDto: CreateUserDto = new UserFactory(prisma)
            .withEmail("test@test.com")
            .withPassword("Str0ngP@ssw0rd")
            .build()
        const response = await request(app.getHttpServer())
            .post('/auth/sign-up')
            .send(userDto)

        expect(response.status).toBe(HttpStatus.CONFLICT)
    });

    it('should return 400 when password is weak', async () => {
        const userDto: CreateUserDto = new UserFactory(prisma)
            .withEmail("test@test.com")
            .withPassword("1234")
            .build()
        const response = await request(app.getHttpServer())
            .post('/auth/sign-up')
            .send(userDto)

        expect(response.status).toBe(HttpStatus.BAD_REQUEST)
    });

    it('should return 401 when bad data', async () => {
        const user: UserLoginDto = new UserFactory(prisma)
            .withEmail("test@test.com")
            .withPassword("Str0ngP@ssw0rd")
            .build()

        const response = await request(app.getHttpServer())
            .post('/auth/sign-in')
            .send(user)

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    })
})