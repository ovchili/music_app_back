import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { genSalt, hash } from 'bcryptjs';
import { UpdateProfileDTO, UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
	) {}

	async getAllUsers(searchTerm?: string) {
		let options = {};

		if (searchTerm) {
			options = {
				$or: [
					{
						email: new RegExp(searchTerm, 'i'),
					},
					{
						login: new RegExp(searchTerm, 'i'),
					},
				],
			};
		}

		return this.userModel
			.find(options)
			.select('-password -updatedAt -__v')
			.sort({ createdAT: 'desc' })
			.exec();
	}

	async getCount() {
		return this.userModel.find({}).count().exec();
	}

	async deleteUser(id: string) {
		return this.userModel.findByIdAndDelete(id);
	}

	async byId(id: string) {
		const user = await this.userModel.findById(id);
		if (!user) throw new NotFoundException('Пользователь не найден');

		return user;
	}

	async updateProfile(id: string, dto: UpdateProfileDTO) {
		const user = await this.byId(id);
		if (dto.email) {
			const isSameEmail = await this.userModel.findOne({ email: dto.email });

			if (isSameEmail && String(id) !== String(isSameEmail._id)) {
				throw new BadRequestException('Почта уже занята');
			}
			user.email = dto.email;
		}
		if (dto.login) {
			const isSameLogin = await this.userModel.findOne({ login: dto.login });
			if (isSameLogin && String(id) !== String(isSameLogin._id)) {
				throw new BadRequestException('Логин уже занят');
			}
			user.login = dto.login;
		}
		if (dto.password) {
			const salt = await genSalt(10);
			user.password = await hash(dto.password, salt);
		}

		await user.save();

		return user;
	}

	async update(id: string, dto: UpdateUserDTO) {
		const user = await this.updateProfile(id, dto);

		if (dto.isAdmin || dto.isAdmin === false) user.isAdmin = dto.isAdmin;

		await user.save();

		return user;
	}
}
