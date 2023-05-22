import { Ref, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { AlbumModel } from 'src/album/album.model';
import { TrackModel } from 'src/track/track.model';
export interface GroupModel extends Base {}
export class GroupModel extends TimeStamps {
	@prop()
	name: string;

	@prop({ unique: true })
	slug: string;

	@prop()
	posterPath: string;

	@prop({ ref: () => AlbumModel })
	albums: Ref<AlbumModel>[];

	@prop({ ref: () => TrackModel })
	tracks: Ref<TrackModel>[];
}
