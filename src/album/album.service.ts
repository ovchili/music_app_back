import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { AlbumModel } from './album.model';
import { CreateAlbumDTO } from './dto/album.dto';

@Injectable()
export class AlbumService {
	constructor(
		@InjectModel(AlbumModel) private readonly albumModel: ModelType<AlbumModel>,
	) {}

	async get(string: string) {
		if (!Types.ObjectId.isValid(string)) {
			const group = await this.albumModel.findOne({ slug: string });

			if (!group) throw new NotFoundException('Группа не найдена');

			return group;
		}

		const group = await this.albumModel.findById(string);
		if (!group) throw new NotFoundException('Группа не найдена');

		return group;
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
			.select('-updatedAt -__v')
			.sort({ createdAT: 'desc' })
			.exec();
	}

	async create(dto: CreateAlbumDTO) {
		const groupBySlug = await this.albumModel.findOne({ slug: dto.slug });

		if (groupBySlug) throw new BadRequestException('Группа уже существует');

		const group = await new this.albumModel(dto).save();

		return group;
	}

	async update(id: string, dto: CreateAlbumDTO) {
		const group = await this.get(id);

		if (dto.slug) {
			const groupBySlug = await this.albumModel.findOne({ slug: dto.slug });

			if (groupBySlug && String(groupBySlug._id) !== String(id))
				throw new BadRequestException('Группа уже существует');

			group.slug = dto.slug;
		}

		if (dto.name) group.name = dto.name;

		await group.save();

		return group;
	}

	async delete(id: string) {
		const group = await this.albumModel.findByIdAndDelete(id);

		if (!group) throw new NotFoundException('Группа не найдена');

		return group;
	}
}
