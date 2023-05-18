import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from 'src/user/user.model';
import { RegisterDTO } from './dto/register.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDTO } from './dto/refreshtoken.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
		private readonly jwtService: JwtService,
	) {}

	async register(dto: RegisterDTO) {
		const sameEmail = await this.userModel.findOne({ email: dto.email });
		if (sameEmail) {
			throw new BadRequestException(
				'Пользователь с указанной почтой уже существует',
			);
		}

		const sameLogin = await this.userModel.findOne({ login: dto.login });
		if (sameLogin) {
			throw new BadRequestException(
				'Пользователь с указанным логином уже существует',
			);
		}

		const salt = await genSalt(10);
		const newUser = await new this.userModel({
			email: dto.email,
			login: dto.login,
			password: await hash(dto.password, salt),
		}).save();

		const tokens = await this.issueTokenPair(String(newUser._id));

		return { user: this.returnUserFields(newUser), ...tokens };
	}

	async login(dto: LoginDTO) {
		const user = await this.validateUser(dto);
		const tokens = await this.issueTokenPair(String(user._id));

		return { user: this.returnUserFields(user), ...tokens };
	}

	async validateUser(dto: LoginDTO): Promise<UserModel> {
		const user =
			(await this.userModel.findOne({ email: dto.loginEmail })) ||
			(await this.userModel.findOne({ login: dto.loginEmail }));

		if (!user) throw new UnauthorizedException('Пользователь не найден');

		const isValidPassword = await compare(dto.password, user.password);

		if (!isValidPassword) throw new UnauthorizedException('Пароль неверный');

		return user;
	}

	async getNewTokens({ refreshToken }: RefreshTokenDTO) {
		if (!refreshToken)
			throw new UnauthorizedException('Пожалуйста, войдите в систему');
		const result = await this.jwtService.verifyAsync(refreshToken);

		if (!result)
			throw new UnauthorizedException('Неверный токен или токен истек');

		const user = await this.userModel.findById(result._id);

		const tokens = await this.issueTokenPair(String(user._id));

		return { user: this.returnUserFields(user), ...tokens };
	}

	async issueTokenPair(userId: string) {
		const data = { _id: userId };

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '7d',
		});

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '1h',
		});

		return { refreshToken, accessToken };
	}

	returnUserFields(user: UserModel) {
		return {
			_id: user._id,
			email: user.email,
			login: user.login,
			isAdmin: user.isAdmin,
		};
	}
}
