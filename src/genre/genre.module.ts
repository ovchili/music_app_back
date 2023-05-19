import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { GenreModel } from './genre.model';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: GenreModel,
				schemaOptions: {
					collection: 'Genre',
				},
			},
		]),
		ConfigModule,
	],
	controllers: [GenreController],
	providers: [GenreService],
})
export class GenreModule {}
