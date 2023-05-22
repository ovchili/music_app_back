import { Ref, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { GroupModel } from 'src/group/group.model';
import { TrackModel } from 'src/track/track.model';
export interface AlbumModel extends Base {}
export class AlbumModel extends TimeStamps {
	@prop()
	name: string;

	@prop({ unique: true })
	slug: string;

	@prop()
	posterPath: string;

	@prop({ ref: () => GroupModel })
	group: Ref<GroupModel>;

	@prop({ ref: () => TrackModel })
	tracks: Ref<TrackModel>[];
}
