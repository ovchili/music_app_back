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
import { GenreService } from './genre.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateGenreDTO } from './dto/genre.dto';
import { idValidationPipe } from 'src/pipes/id.validation.pipe';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('genres')
@ApiBearerAuth()
@Controller('genres')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@Get('')
	@Auth()
	@ApiQuery({ name: 'searchTerm', description: 'Поиск', required: false })
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.genreService.getAll(searchTerm);
	}

	@Get(':slug')
	@Auth()
	async getBySlug(@Param('slug') string: string) {
		return this.genreService.get(string);
	}

	@Get(':id')
	@Auth('admin')
	async getById(@Param('id') id: string) {
		return this.genreService.get(id);
	}

	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe())
	@Post()
	@Auth('admin')
	async create(@Body() dto: CreateGenreDTO) {
		return this.genreService.create(dto);
	}

	@Auth('admin')
	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe())
	@Put(':id')
	async update(
		@Param('id', idValidationPipe) id: string,
		@Body() dto: CreateGenreDTO,
	) {
		return this.genreService.update(id, dto);
	}

	@Auth('admin')
	@HttpCode(HttpStatus.OK)
	@Delete(':id')
	async delete(@Param('id', idValidationPipe) id: string) {
		return this.genreService.delete(id);
	}
}
