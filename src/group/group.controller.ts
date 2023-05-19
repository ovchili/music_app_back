import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { idValidationPipe } from 'src/pipes/id.validation.pipe';
import { CreateGroupDTO } from './dto/create-group.dto';

@ApiBearerAuth()
@ApiTags('groups')
@Controller('groups')
export class GroupController {
	constructor(private readonly groupService: GroupService) {}

	@Get('')
	@Auth()
	@ApiQuery({ name: 'searchTerm', description: 'Поиск', required: false })
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.groupService.getAll(searchTerm);
	}

	@Get(':slug')
	@Auth()
	async getBySlug(@Param('slug') string: string) {
		return this.groupService.get(string);
	}

	@Get(':id')
	@Auth('admin')
	async getById(@Param('id') id: string) {
		return this.groupService.get(id);
	}

	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe())
	@Post()
	@Auth('admin')
	async create(@Body() dto: CreateGroupDTO) {
		return this.groupService.create(dto);
	}

	@Auth('admin')
	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe())
	@Put(':id')
	async update(
		@Param('id', idValidationPipe) id: string,
		@Body() dto: CreateGroupDTO,
	) {
		return this.groupService.update(id, dto);
	}

	@Auth('admin')
	@HttpCode(HttpStatus.OK)
	@Delete(':id')
	async delete(@Param('id', idValidationPipe) id: string) {
		return this.groupService.delete(id);
	}
}
