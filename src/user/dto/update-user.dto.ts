import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDTO {
	@ApiPropertyOptional({ description: 'Логин', minLength: 8 })
	@MinLength(8, {
		message: 'Логин должен быть больше 8 символов',
	})
	@IsOptional()
	@IsString()
	login: string;

	@ApiPropertyOptional({ description: 'Почта' })
	@IsOptional()
	@IsEmail()
	email: string;

	@ApiPropertyOptional({ description: 'Пароль', minLength: 6 })
	@IsOptional()
	@IsString()
	@MinLength(6, {
		message: 'Пароль должен быть больше 6 символов',
	})
	password: string;

	@ApiPropertyOptional({ description: 'Пользователь - админ?', default: false })
	@IsOptional()
	isAdmin: boolean;
}

export class UpdateProfileDTO {
	@ApiPropertyOptional({ description: 'Логин', minLength: 8 })
	@MinLength(8, {
		message: 'Логин должен быть больше 8 символов',
	})
	@IsOptional()
	@IsString()
	login: string;

	@ApiPropertyOptional({ description: 'Почта' })
	@IsOptional()
	@IsEmail()
	email: string;

	@ApiPropertyOptional({ description: 'Пароль', minLength: 6 })
	@IsOptional()
	@IsString()
	@MinLength(6, {
		message: 'Пароль должен быть больше 6 символов',
	})
	password: string;
}
