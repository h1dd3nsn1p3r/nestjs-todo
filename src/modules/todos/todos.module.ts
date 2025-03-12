import { Module } from '@nestjs/common';
import { TodosController } from '@/modules/todos/todos.controller';
import { TodosService } from '@/modules/todos/todos.service';

@Module({
	controllers: [TodosController],
	providers: [TodosService],
})
export class TodosModule {}
