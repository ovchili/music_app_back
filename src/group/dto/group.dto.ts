import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateGroupDTO {
	@ApiProperty({ description: 'Название группы' })
	@IsString()
	name: string;

	@ApiProperty({ description: 'Slug группы', uniqueItems: true })
	@IsString()
	slug: string;

	@ApiProperty({
		description: 'Путь к файлу постера группы',
		uniqueItems: true,
	})
	@IsString()
	posterPath: string;
}

export class UpdateGroupDTO {
	@ApiPropertyOptional({ description: 'Название группы' })
	@IsString()
	@IsOptional()
	name: string;

	@ApiPropertyOptional({ description: 'Slug группы', uniqueItems: true })
	@IsString()
	@IsOptional()
	slug: string;

	@ApiPropertyOptional({
		description: 'Путь к файлу постера группы',
		uniqueItems: true,
	})
	@IsString()
	@IsOptional()
	posterPath: string;
}
