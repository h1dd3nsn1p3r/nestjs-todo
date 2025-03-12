import {
	Get,
	Res,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	HttpCode,
	Controller,
	ParseIntPipe,
} from '@nestjs/common';
import { TodosService } from '@/modules/todos/todos.service';

import type { Response } from 'express';

@Controller('todos')
export class TodosController {
	constructor(private readonly todosService: TodosService) {}

	/**
	 * HTTP GET /todos
	 *
	 * Get all todos.
	 *
	 * @since 1.0.0
	 */
	@Get()
	@HttpCode(200)
	async getAll(@Res() res: Response): Promise<Response> {
		try {
			const results = await this.todosService.findAll();
			return res.json({ status: true, data: results });
		} catch (err: any) {
			return res.status(500).json({ status: false, message: err.message });
		}
	}

	/**
	 * HTTP GET /todos/:id
	 *
	 * Get a todo via id.
	 *
	 * @since 1.0.0
	 */
	@Get(':id')
	@HttpCode(200)
	async getOne(
		@Param('id', ParseIntPipe) id: number,
		@Res() res: Response,
	): Promise<Response> {
		try {
			const result = await this.todosService.findOne(id);
			return res.json({ status: true, data: result });
		} catch (err: any) {
			return res.status(500).json({ status: false, message: err.message });
		}
	}

	/**
	 * HTTP POST /todos
	 *
	 * Create a new todo.
	 *
	 * @since 1.0.0
	 */
	@Post()
	@HttpCode(200)
	async create(
		@Body() body: Record<string, any>,
		@Res() res: Response,
	): Promise<Response> {
		try {
			// Simple validation
			// @Todo: Later we can add zod validation via pipes or manually.
			if (!body || !body.title || !body.title?.trim().length) {
				return res.status(400).json({
					status: false,
					message: 'Bad request! Required todo data is missing.',
				});
			}

			const result = await this.todosService.create(body.title);

			return res.json({
				status: true,
				message: 'Success, Todo added!',
				data: result,
			});
		} catch (err: any) {
			console.error(err.message);
			return res.status(500).json({ status: false, message: err.message });
		}
	}

	/**
	 * HTTP PATCH /todos/:id
	 *
	 * Update a todo via id.
	 *
	 * @since 1.0.0
	 */
	@Patch(':id')
	@HttpCode(200)
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() body: Record<string, string>,
		@Res() res: Response,
	): Promise<Response> {
		try {
			// Simple validation
			// @Todo: Later we can add zod validation via pipes or manually.
			if (!body || !Object.keys(body).length) {
				return res.status(400).json({
					status: false,
					message: 'Bad request! Required todo data is missing.',
				});
			}

			const result = await this.todosService.update(id, body.title);

			return res.json({ status: true, data: result });
		} catch (err: any) {
			return res.status(500).json({ status: false, message: err.message });
		}
	}

	/**
	 * HTTP DELETE /todos/:id
	 *
	 * Delete a todo via id.
	 *
	 * @since 1.0.0
	 */
	@Delete(':id')
	@HttpCode(200)
	async deleteTodo(
		@Param('id', ParseIntPipe) id: number,
		@Res() res: Response,
	): Promise<Response> {
		try {
			const result = await this.todosService.deleteTodo(id);

			return res.json({
				status: result ? true : false,
				message: result ? 'Todo deleted!' : 'Todo not found!',
			});
		} catch (err: any) {
			return res.status(500).json({ status: false, message: err.message });
		}
	}
}
