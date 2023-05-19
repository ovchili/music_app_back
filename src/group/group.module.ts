import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { GroupModel } from './group.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: GroupModel,
				schemaOptions: {
					collection: 'Group',
				},
			},
		]),
		ConfigModule,
	],
	controllers: [GroupController],
	providers: [GroupService],
})
export class GroupsModule {}
