import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest() //pegando objeto da request
        const { authorization } = request.headers;

        try {
            const data = this.authService.verifyToken((authorization ?? "").split(" ")[1]); // token é legítimo?
            const user = await this.userService.findUserById(parseInt(data.id))

            request.user = user //colocando usuario quando do requant
            return true
        } catch (err) {
            throw new UnauthorizedException()
        }
    }

}