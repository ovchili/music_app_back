import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { GenreModel } from './genre.model';
import { CreateGenreDTO } from './dto/genre.dto';
import { Types } from 'mongoose';

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(GenreModel) private readonly genreModel: ModelType<GenreModel>,
	) {}

	NOT_FOUND_MESSAGE = 'Жанр не найден';
	IS_EXISTS_MESSAGE = 'Жанр уже существует';

	async get(string: string) {
		if (!Types.ObjectId.isValid(string)) {
			const genre = await this.genreModel.findOne({ slug: string });

			if (!genre) throw new NotFoundException(this.NOT_FOUND_MESSAGE);

			return genre;
		}

		const genre = await this.genreModel.findById(string);
		if (!genre) throw new NotFoundException(this.NOT_FOUND_MESSAGE);

		return genre;
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

		return this.genreModel
			.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAT: 'desc' })
			.exec();
	}

	async create(dto: CreateGenreDTO) {
		const genreBySlug = await this.genreModel.findOne({ slug: dto.slug });

		if (genreBySlug) throw new BadRequestException(this.IS_EXISTS_MESSAGE);

		const genre = await new this.genreModel(dto).save();

		return genre;
	}

	async update(id: string, dto: CreateGenreDTO) {
		const genre = await this.get(id);

		if (dto.slug) {
			const genreBySlug = await this.genreModel.findOne({ slug: dto.slug });

			if (genreBySlug && String(genreBySlug._id) !== String(id))
				throw new BadRequestException(this.IS_EXISTS_MESSAGE);

			genre.slug = dto.slug;
		}

		if (dto.name) genre.name = dto.name;

		await genre.save();

		return genre;
	}

	async delete(id: string) {
		const genre = await this.genreModel.findByIdAndDelete(id);

		if (!genre) throw new NotFoundException(this.NOT_FOUND_MESSAGE);

		return genre;
	}
}
