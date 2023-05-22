import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateTrackDTO {
	@ApiProperty({ description: 'Название трека' })
	@IsString()
	name: string;

	@ApiProperty({ description: 'Slug трека', uniqueItems: true })
	@IsString()
	slug: string;

	@ApiProperty({
		description: 'Путь к файлу трека',
	})
	@IsString()
	trackPath: string;

	@ApiProperty({
		description: 'Путь к файлу постера трека',
	})
	@IsString()
	posterPath: string;

	@ApiProperty({
		description: 'Идентификатор группы',
	})
	@IsString()
	album: string;

	@ApiProperty({
		description: 'Идентификатор жанра',
	})
	@IsString()
	genre: string;

	@ApiProperty({
		description: 'Идентификатор группы',
	})
	@IsString()
	group: string;
}

export class UpdateTrackDTO {
	@ApiPropertyOptional({ description: 'Название трека' })
	@IsString()
	@IsOptional()
	name: string;

	@ApiPropertyOptional({ description: 'Slug трека', uniqueItems: true })
	@IsString()
	@IsOptional()
	slug: string;

	@ApiPropertyOptional({
		description: 'Путь к файлу трека',
	})
	@IsString()
	@IsOptional()
	trackPath: string;

	@ApiPropertyOptional({
		description: 'Путь к файлу постера трека',
	})
	@IsString()
	@IsOptional()
	posterPath: string;

	@ApiPropertyOptional({
		description: 'Идентификатор группы',
	})
	@IsString()
	@IsOptional()
	album: string;

	@ApiPropertyOptional({
		description: 'Идентификатор жанра',
	})
	@IsString()
	@IsOptional()
	genre: string;

	@ApiPropertyOptional({
		description: 'Идентификатор группы',
	})
	@IsString()
	@IsOptional()
	group: string;
}
