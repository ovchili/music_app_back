import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from './decorators/user.decorator';
import { UpdateUserDTO } from './dto/update-user.dto';
import { idValidationPipe } from 'src/pipes/id.validation.pipe';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('counts')
	@Auth('admin')
	async getCount() {
		return this.userService.getCount();
	}

	@Get('')
	@ApiQuery({ name: 'searchTerm', description: 'Поиск', required: false })
	@Auth('admin')
	async getAllUser(@Query('searchTerm') searchTerm?: string) {
		return this.userService.getAllUsers(searchTerm);
	}

	@Get('profile')
	@Auth()
	async getProfile(@User('_id') id: string) {
		return this.userService.byId(id);
	}

	@Get(':id')
	@Auth('admin')
	async getUser(@Param('id', idValidationPipe) id: string) {
		return this.userService.byId(id);
	}

	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe())
	@Put('profile')
	@Auth()
	async updateProfile(@User('_id') id: string, @Body() dto: UpdateUserDTO) {
		return this.userService.updateProfile(id, dto);
	}

	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe())
	@Put(':id')
	@Auth('admin')
	async updateUser(
		@Param('id', idValidationPipe) id: string,
		@Body() dto: UpdateUserDTO,
	) {
		return this.userService.updateProfile(id, dto);
	}

	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe())
	@Delete(':id')
	@Auth('admin')
	async deleteUser(@Param('id', idValidationPipe) id: string) {
		return this.userService.deleteUser(id);
	}
}
