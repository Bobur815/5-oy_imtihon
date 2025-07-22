import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt} from 'passport-jwt'
import { UsersService } from "src/core/modules/users/users.service";
import { JwtPayload } from "./jwt-payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly userService: UsersService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET!
            
        })
    }
    async validate(payload:JwtPayload){
        const user = await this.userService.getSingle(payload.id)
        if (!user) {
            throw new UnauthorizedException();
        }

        return { id: payload.id, username: payload.phone, role: user.role };
    }
}