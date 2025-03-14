import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from '@/config/config';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

import { TodosModule } from '@/modules/todos/todos.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [appConfig],
			isGlobal: true,
			expandVariables: true,
		}),
		TodosModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
