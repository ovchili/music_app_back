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
import { TrackService } from './track.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';

import { idValidationPipe } from 'src/pipes/id.validation.pipe';

import { CreateTrackDTO, UpdateTrackDTO } from './dto/track.dto';
import { Types } from 'mongoose';

@ApiBearerAuth()
@ApiTags('tracks')
@Controller('tracks')
export class TrackController {
	constructor(private readonly trackService: TrackService) {}

	@Get('')
	@Auth()
	@ApiQuery({ name: 'searchTerm', description: 'Поиск', required: false })
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.trackService.getAll(searchTerm);
	}

	@Get('by-slug/:slug')
	@Auth()
	async getBySlug(@Param('slug') string: string) {
		return this.trackService.getBySlug(string);
	}

	@Post('by-genres/')
	@HttpCode(HttpStatus.OK)
	@Auth()
	@ApiBody({
		schema: {
			properties: {
				genres: {
					items: {},
				},
			},
		},
	})
	async getByGenres(@Body('genres') genres: Types.ObjectId[]) {
		return this.trackService.getByGenres(genres);
	}

	@Post('by-groups/')
	@HttpCode(HttpStatus.OK)
	@Auth()
	@ApiBody({
		schema: {
			properties: {
				groups: {
					items: {},
				},
			},
		},
	})
	async getByGroups(@Body('groups') groups: Types.ObjectId[]) {
		return this.trackService.getByGroups(groups);
	}

	@Get('most-popular')
	@Auth()
	async getMostPopular() {
		return this.trackService.getMostPopular();
	}

	@Post('update-count-played')
	@ApiBody({
		schema: {
			properties: {
				slug: {
					description: '',
				},
			},
		},
	})
	@Auth()
	@HttpCode(HttpStatus.OK)
	async updateCountPlayed(@Body('slug') slug: string) {
		return this.updateCountPlayed(slug);
	}

	@Get(':id')
	@Auth('admin')
	async getById(@Param('id', idValidationPipe) id: string) {
		return this.trackService.getById(id);
	}

	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe())
	@Post()
	@Auth('admin')
	async create(@Body() dto: CreateTrackDTO) {
		return this.trackService.create(dto);
	}

	@Auth('admin')
	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe())
	@Put(':id')
	async update(
		@Param('id', idValidationPipe) id: string,
		@Body() dto: UpdateTrackDTO,
	) {
		return this.trackService.update(id, dto);
	}

	@Auth('admin')
	@HttpCode(HttpStatus.OK)
	@Delete(':id')
	async delete(@Param('id', idValidationPipe) id: string) {
		return this.trackService.delete(id);
	}
}
