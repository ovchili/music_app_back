import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateGenreDTO {
	@ApiProperty({ description: 'Название жанра' })
	@IsString()
	name: string;

	@ApiProperty({ description: 'Slug жанра', uniqueItems: true })
	@IsString()
	slug: string;
}
