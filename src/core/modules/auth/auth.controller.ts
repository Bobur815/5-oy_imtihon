import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiCreatedResponse, ApiOkResponse, } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @Public()
    @ApiOperation({ summary: 'Register a new user with phone, password, fullName and OTP code' })
    @ApiBody({ type: RegisterDto })
    @ApiCreatedResponse({
        description: 'User registered and tokens issued',
        type: Object,
        example: {
            accessToken: 'eyJhbGciOiJ...',
            refreshToken: 'eyJhbGciOiJ...',
        },
    })
    async register(@Body() payload: RegisterDto) {
        return this.authService.register(payload);
    }

    @Post('login')
    @Public()
    @ApiOperation({ summary: 'Login user with phone and password' })
    @ApiBody({ type: LoginDto })
    @ApiOkResponse({
        description: 'User logged in and tokens issued',
        type: Object,
        example: {
            accessToken: 'eyJhbGciOiJ...',
            refreshToken: 'eyJhbGciOiJ...',
        },
    })
    async login(@Body() payload: LoginDto) {
        return this.authService.login(payload);
    }
}
