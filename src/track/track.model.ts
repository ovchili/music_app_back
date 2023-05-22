import { Ref, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { AlbumModel } from 'src/album/album.model';
import { GenreModel } from 'src/genre/genre.model';
import { GroupModel } from 'src/group/group.model';
export interface TrackModel extends Base {}
export class TrackModel extends TimeStamps {
	@prop()
	name: string;

	@prop({ unique: true })
	slug: string;

	@prop()
	trackPath: string;

	@prop()
	posterPath: string;

	@prop({ default: 0 })
	countPlayed: number;

	@prop({ ref: () => AlbumModel })
	album: Ref<AlbumModel>;

	@prop({ ref: () => GenreModel })
	genre: Ref<GenreModel>;

	@prop({ ref: () => GroupModel })
	group: Ref<GroupModel>;
}
