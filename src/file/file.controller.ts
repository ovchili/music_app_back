import {
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('files')
@Controller('files')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@ApiConsumes('multipart/form-data')
	@Post()
	@HttpCode(HttpStatus.OK)
	@Auth('admin')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
		@Query('folder') folder?: string,
	) {
		return this.fileService.saveFiles([file], folder);
	}
}
