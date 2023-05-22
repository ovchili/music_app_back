import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { AlbumModel } from './album.model';
import { ConfigModule } from '@nestjs/config';
import { GroupModel } from 'src/group/group.model';

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: AlbumModel,
				schemaOptions: {
					collection: 'Album',
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
	controllers: [AlbumController],
	providers: [AlbumService],
})
export class AlbumModule {}
