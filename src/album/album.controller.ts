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
import { AlbumService } from './album.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiQuery, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { idValidationPipe } from 'src/pipes/id.validation.pipe';
import { CreateAlbumDTO, UpdateAlbumDTO } from './dto/album.dto';

@ApiBearerAuth()
@ApiTags('albums')
@Controller('albums')
export class AlbumController {
	constructor(private readonly albumService: AlbumService) {}

	@Get('')
	@Auth()
	@ApiQuery({ name: 'searchTerm', description: 'Поиск', required: false })
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.albumService.getAll(searchTerm);
	}

	@Get(':slug')
	@Auth()
	async getBySlug(@Param('slug') string: string) {
		return this.albumService.get(string);
	}

	@Get(':id')
	@Auth('admin')
	async getById(@Param('id') id: string) {
		return this.albumService.get(id);
	}

	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe())
	@Post()
	@Auth('admin')
	async create(@Body() dto: CreateAlbumDTO) {
		return this.albumService.create(dto);
	}

	@Auth('admin')
	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe())
	@Put(':id')
	async update(
		@Param('id', idValidationPipe) id: string,
		@Body() dto: UpdateAlbumDTO,
	) {
		return this.albumService.update(id, dto);
	}

	@Auth('admin')
	@HttpCode(HttpStatus.OK)
	@Delete(':id')
	async delete(@Param('id', idValidationPipe) id: string) {
		return this.albumService.delete(id);
	}
}
