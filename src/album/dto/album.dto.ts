import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateAlbumDTO {
	@ApiProperty({ description: 'Название альбома' })
	@IsString()
	name: string;

	@ApiProperty({ description: 'Slug альбома', uniqueItems: true })
	@IsString()
	slug: string;

	@ApiProperty({
		description: 'Путь к файлу постера альбома',
		uniqueItems: true,
	})
	@IsString()
	posterPath: string;

	@ApiProperty({
		description: 'Группа',
	})
	@IsString()
	group: string;
}

export class UpdateAlbumDTO {
	@ApiPropertyOptional({ description: 'Название альбома' })
	@IsOptional()
	@IsString()
	name: string;

	@ApiPropertyOptional({ description: 'Slug альбома', uniqueItems: true })
	@IsOptional()
	@IsString()
	slug: string;

	@ApiPropertyOptional({
		description: 'Путь к файлу постера альбома',
		uniqueItems: true,
	})
	@IsOptional()
	@IsString()
	posterPath: string;

	@ApiPropertyOptional({
		description: 'Группа',
	})
	@IsOptional()
	@IsString()
	group: string;
}
