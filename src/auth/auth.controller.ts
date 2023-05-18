import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { RefreshTokenDTO } from './dto/refreshtoken.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: RegisterDTO) {
		return this.authService.register(dto);
	}

	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe())
	@Post('login')
	async login(@Body() dto: LoginDTO) {
		return this.authService.login(dto);
	}

	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe())
	@Post('login/access')
	async getNewTokens(@Body() dto: RefreshTokenDTO) {
		return this.authService.getNewTokens(dto);
	}
}
