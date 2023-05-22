import { Ref, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { TrackModel } from 'src/track/track.model';
export interface GenreModel extends Base {}
export class GenreModel extends TimeStamps {
	@prop()
	name: string;

	@prop({ unique: true })
	slug: string;

	@prop({ ref: () => TrackModel })
	tracks: Ref<TrackModel>[];
}
