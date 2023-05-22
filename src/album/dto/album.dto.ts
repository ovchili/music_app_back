import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAlbumDTO {
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
