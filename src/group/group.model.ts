import { Ref, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { AlbumModel } from 'src/album/album.model';
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
}
