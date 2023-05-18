import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDTO {
	@ApiProperty({ description: 'Refresh Token для авторизации' })
	@IsString()
	refreshToken: string;
}
