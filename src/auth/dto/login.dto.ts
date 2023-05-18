import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDTO {
	@ApiProperty({ description: 'Логин или почта для входа' })
	@IsString()
	loginEmail: string;
	@ApiProperty({ description: 'Пароль для входа', minLength: 6 })
	@IsString()
	@MinLength(6, {
		message: 'Пароль должен быть больше 6 символов',
	})
	password: string;
}
