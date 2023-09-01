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

describe('Credential E2E test', () => {
    let app: INestApplication;
    let prisma: PrismaService = new PrismaService()
    let jwt: JwtService = new JwtService()

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

    it('should return 201 when creating a credential', async () => {
        const user = await new UserFactory(prisma)
            .withEmail("test@test.com")
            .withPassword("Str0ngP@ssw0rd")
            .persist()
        const token = await E2EUtils.generateValidToken(jwt, user)

        const response = await request(app.getHttpServer())
            .get('/enrollments')
            .set('Authorization', `Bearer ${token}`)
            .send(user)

        expect(response.status).toBe(HttpStatus.CREATED)
    })
})