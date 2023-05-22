import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { TrackModel } from './track.model';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateTrackDTO, UpdateTrackDTO } from './dto/track.dto';
import { AlbumModel } from 'src/album/album.model';
import { GenreModel } from 'src/genre/genre.model';
import { GroupModel } from 'src/group/group.model';
import { Types } from 'mongoose';

@Injectable()
export class TrackService {
	constructor(
		@InjectModel(TrackModel) private readonly trackModel: ModelType<TrackModel>,
		@InjectModel(AlbumModel) private readonly albumModel: ModelType<AlbumModel>,
		@InjectModel(GenreModel) private readonly genreModel: ModelType<GenreModel>,
		@InjectModel(GroupModel) private readonly groupModel: ModelType<GroupModel>,
	) {}

	NOT_FOUND_MESSAGE = 'Трек не найден';
	IS_EXISTS_MESSAGE = 'Трек уже существует';

	async getByGenres(genres: Types.ObjectId[]) {
		const track = await this.trackModel
			.find({ genre: { $in: genres } })
			.populate('album group')
			.exec();
		if (!track) throw new NotFoundException(this.NOT_FOUND_MESSAGE);

		return track;
	}

	async getBySlug(slug: string) {
		const track = await this.trackModel
			.find({ slug })
			.populate('album genre group')
			.exec();
		if (!track) throw new NotFoundException(this.NOT_FOUND_MESSAGE);

		return track;
	}

	async getByGroups(groups: Types.ObjectId[]) {
		const track = await this.trackModel
			.find({ group: { $in: groups } })
			.populate('album genre')
			.exec();
		if (!track) throw new NotFoundException(this.NOT_FOUND_MESSAGE);

		return track;
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

		return this.trackModel
			.find(options)
			.select('-updatedAt -__v')
			.populate('album genre group')
			.sort({ createdAT: 'desc' })
			.exec();
	}

	async getMostPopular() {
		return await this.trackModel
			.find({ countPlayed: { $gt: 0 } })
			.sort({ countPlayed: -1 })
			.populate('group album')
			.exec();
	}

	async updateCountPlay(slug: string) {
		const track = await this.trackModel
			.findOneAndUpdate(
				{ slug },
				{
					$inc: { countPlayed: 1 },
				},
			)
			.exec();

		if (!track) throw new NotFoundException(this.NOT_FOUND_MESSAGE);

		return track;
	}

	async getById(id: string) {
		const track = await this.trackModel
			.findById(id)
			.populated('album genre group')
			.exec();
		if (!track) throw new NotFoundException(this.NOT_FOUND_MESSAGE);

		return track;
	}

	async create(dto: CreateTrackDTO) {
		const trackBySlug = await this.trackModel.findOne({ slug: dto.slug });

		if (trackBySlug) throw new BadRequestException(this.IS_EXISTS_MESSAGE);

		const track = await new this.trackModel(dto).save();

		return track;
	}

	async update(id: string, dto: UpdateTrackDTO) {
		const track = await this.getById(id);

		if (dto.slug) {
			const trackBySlug = await this.trackModel.findOne({ slug: dto.slug });

			if (trackBySlug && String(trackBySlug._id) !== String(id))
				throw new BadRequestException(this.IS_EXISTS_MESSAGE);

			track.slug = dto.slug;
		}

		if (dto.name) track.name = dto.name;

		if (dto.posterPath) track.posterPath = dto.posterPath;

		if (dto.trackPath) track.trackPath = dto.trackPath;

		if (dto.album) {
			const album = await this.albumModel.findByIdAndUpdate(
				dto.album,
				{ $push: { tracks: track._id } },
				{ new: true, useFindAndModify: false },
			);

			track.album = album;
		}

		if (dto.genre) {
			const genre = await this.genreModel.findByIdAndUpdate(
				dto.genre,
				{ $push: { tracks: track._id } },
				{ new: true, useFindAndModify: false },
			);

			track.genre = genre;
		}

		if (dto.group) {
			const group = await this.groupModel.findByIdAndUpdate(
				dto.group,
				{ $push: { tracks: track._id } },
				{ new: true, useFindAndModify: false },
			);

			track.group = group;
		}

		await track.save();

		return track;
	}

	async delete(id: string) {
		const track = await this.trackModel.findByIdAndDelete(id);

		if (!track) throw new NotFoundException(this.NOT_FOUND_MESSAGE);

		return track;
	}
}
