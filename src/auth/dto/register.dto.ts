import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDTO {
	@ApiProperty({ description: 'Логин для регистрации', minLength: 8 })
	@MinLength(8, {
		message: 'Логин должен быть больше 8 символов',
	})
	@IsString()
	login: string;
	@ApiProperty({ description: 'Почта для регистрации' })
	@IsEmail()
	email: string;

	@ApiProperty({ description: 'Пароль для регистрации', minLength: 6 })
	@IsString()
	@MinLength(6, {
		message: 'Пароль должен быть больше 6 символов',
	})
	password: string;
}
