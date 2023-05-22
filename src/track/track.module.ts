import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule } from '@nestjs/config';
import { TrackModel } from './track.model';
import { AlbumModel } from 'src/album/album.model';
import { GenreModel } from 'src/genre/genre.model';
import { GroupModel } from 'src/group/group.model';

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: TrackModel,
				schemaOptions: {
					collection: 'Track',
				},
			},
			{
				typegooseClass: AlbumModel,
				schemaOptions: {
					collection: 'Album',
				},
			},
			{
				typegooseClass: GenreModel,
				schemaOptions: {
					collection: 'Genre',
				},
			},
			{
				typegooseClass: GroupModel,
				schemaOptions: {
					collection: 'Group',
				},
			},
		]),
		ConfigModule,
	],
	controllers: [TrackController],
	providers: [TrackService],
})
export class TrackModule {}
