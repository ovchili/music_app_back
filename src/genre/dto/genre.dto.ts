import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateGenreDTO {
	@ApiProperty({ description: 'Название жанра' })
	@IsString()
	name: string;

	@ApiProperty({ description: 'Slug жанра', uniqueItems: true })
	@IsString()
	slug: string;
}

export class UpdateGenreDTO {
	@ApiPropertyOptional({ description: 'Название жанра' })
	@IsString()
	@IsOptional()
	name: string;

	@ApiPropertyOptional({ description: 'Slug жанра', uniqueItems: true })
	@IsString()
	@IsOptional()
	slug: string;
}
