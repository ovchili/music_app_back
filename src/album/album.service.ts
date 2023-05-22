import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { AlbumModel } from './album.model';
import { CreateAlbumDTO, UpdateAlbumDTO } from './dto/album.dto';
import { GroupModel } from 'src/group/group.model';

@Injectable()
export class AlbumService {
	constructor(
		@InjectModel(AlbumModel) private readonly albumModel: ModelType<AlbumModel>,

		@InjectModel(GroupModel) private readonly groupModel: ModelType<GroupModel>,
	) {}

	NOT_FOUND_MESSAGE = 'Альбом не найден';
	IS_EXISTS_MESSAGE = 'Альбом уже существует';

	async get(string: string) {
		if (!Types.ObjectId.isValid(string)) {
			const album = await this.albumModel.findOne({ slug: string });

			if (!album) throw new NotFoundException(this.NOT_FOUND_MESSAGE);

			return album;
		}

		const album = await this.albumModel.findById(string);
		if (!album) throw new NotFoundException(this.NOT_FOUND_MESSAGE);

		return album;
	}

	async getAll(searchTerm?: string) {
		let options = {};

		if (searchTerm) {
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, 'i'),
					},
					{
						slug: new RegExp(searchTerm, 'i'),
					},
				],
			};
		}

		return this.albumModel
			.find(options)
			.populate('group')
			.select('-updatedAt -__v')
			.sort({ createdAT: 'desc' })
			.exec();
	}

	async create(dto: CreateAlbumDTO) {
		const albumBySlug = await this.albumModel.findOne({ slug: dto.slug });

		if (albumBySlug) throw new BadRequestException(this.IS_EXISTS_MESSAGE);

		const album = await new this.albumModel(dto).save();

		await this.groupModel.findByIdAndUpdate(
			dto.group,
			{ $push: { albums: album._id } },
			{ new: true, useFindAndModify: false },
		);
		return album;
	}

	async update(id: string, dto: UpdateAlbumDTO) {
		const album = await this.get(id);

		if (dto.slug) {
			const albumBySlug = await this.albumModel.findOne({ slug: dto.slug });

			if (albumBySlug && String(albumBySlug._id) !== String(id))
				throw new BadRequestException(this.IS_EXISTS_MESSAGE);

			album.slug = dto.slug;
		}

		if (dto.name) album.name = dto.name;

		if (dto.posterPath) album.posterPath = dto.posterPath;

		if (dto.group) {
			const group = await this.groupModel.findByIdAndUpdate(
				dto.group,
				{ $push: { albums: album._id } },
				{ new: true, useFindAndModify: false },
			);

			album.group = group;
		}

		await album.save();

		return album;
	}

	async delete(id: string) {
		const album = await this.albumModel.findByIdAndDelete(id);

		if (!album) throw new NotFoundException(this.NOT_FOUND_MESSAGE);

		return album;
	}
}
