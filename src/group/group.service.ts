import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { GroupModel } from './group.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateGroupDTO, UpdateGroupDTO } from './dto/group.dto';

@Injectable()
export class GroupService {
	constructor(
		@InjectModel(GroupModel) private readonly groupModel: ModelType<GroupModel>,
	) {}

	NOT_FOUND_MESSAGE = 'Группа не найдена';
	IS_EXISTS_MESSAGE = 'Группа уже существует';

	async get(string: string) {
		if (!Types.ObjectId.isValid(string)) {
			const group = await this.groupModel.findOne({ slug: string });

			if (!group) throw new NotFoundException(this.NOT_FOUND_MESSAGE);

			return group;
		}

		const group = await this.groupModel.findById(string);
		if (!group) throw new NotFoundException(this.NOT_FOUND_MESSAGE);

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

		return this.groupModel
			.find(options)
			.populate('albums tracks')
			.select('-updatedAt -__v')
			.sort({ createdAT: 'desc' })
			.exec();
	}

	async create(dto: CreateGroupDTO) {
		const groupBySlug = await this.groupModel.findOne({ slug: dto.slug });

		if (groupBySlug) throw new BadRequestException(this.IS_EXISTS_MESSAGE);

		const group = await new this.groupModel(dto).save();

		return group;
	}

	async update(id: string, dto: UpdateGroupDTO) {
		const group = await this.get(id);

		if (dto.slug) {
			const groupBySlug = await this.groupModel.findOne({ slug: dto.slug });

			if (groupBySlug && String(groupBySlug._id) !== String(id))
				throw new BadRequestException(this.IS_EXISTS_MESSAGE);

			group.slug = dto.slug;
		}

		if (dto.name) group.name = dto.name;

		await group.save();

		return group;
	}

	async delete(id: string) {
		const group = await this.groupModel.findByIdAndDelete(id);

		if (!group) throw new NotFoundException(this.NOT_FOUND_MESSAGE);

		return group;
	}
}
