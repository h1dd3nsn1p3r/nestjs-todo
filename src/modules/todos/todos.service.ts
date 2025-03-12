import { Injectable } from '@nestjs/common';

import { db } from '@/data/db';

@Injectable()
export class TodosService {
	constructor() {}

	/**
	 * Get all todo's from the database.
	 *
	 * @returns {<Record<string, string>[]>} List of todo's.
	 * @throws {Error} If there's an error fetching todo's.
	 * @memberof TodosService
	 * @since 1.0.0
	 */
	public async findAll(): Promise<Record<string, string>[]> {
		try {
			const result = await db.all(`SELECT * FROM todos`);

			if (!result || !result.length) {
				return [];
			}

			const items: Record<string, any>[] = [];

			for (const item of result) {
				items.push({
					id: item.id,
					title: item.title,
					completed: item.completed === 0 ? false : true,
				});
			}

			return items;
		} catch (err: any) {
			throw new Error(
				err?.message || "Failed to fetch todo's from the database.",
			);
		}
	}

	/**
	 * Get a todo via id.
	 *
	 * @param {number} id
	 * @returns {Record<string, string>}
	 * @throws {Error} If there's an error fetching todo's.
	 * @memberof TodosService
	 * @since 1.0.0
	 */
	public async findOne(id: number): Promise<Record<string, any> | null> {
		try {
			const result = await db.get(`SELECT * FROM todos WHERE id = ?`, [id]);

			if (!result || !Object.keys(result).length) {
				return null;
			}

			return {
				id: result.id,
				title: result.title,
				completed: result.completed === 0 ? false : true,
			};
		} catch (err: any) {
			throw new Error(
				err?.message || "Failed to fetch todo's from the database.",
			);
		}
	}

	/**
	 * Insert a new todo.
	 *
	 * @param {string} title
	 * @returns {Promise<Record<string, any>>}
	 * @throws {Error}
	 * @memberof TodosService
	 * @since 1.0.0
	 */
	public async create(title: string): Promise<Record<string, any>> {
		try {
			const result = await db.get(
				`INSERT INTO todos (title, completed) VALUES (?, ?) RETURNING *`,
				[title, false],
			);

			if (!result || !Object.keys(result).length) {
				throw new Error('Failed to create todo.');
			}

			return {
				id: result.id,
				title: result.title,
				completed: result.completed === 0 ? false : true,
			};
		} catch (err: any) {
			throw new Error(err?.message || 'Failed to create todo.');
		}
	}

	/**
	 * Update the todo via id.
	 *
	 * @param {number} id
	 * @param {string} title
	 * @returns {Promise<Record<string, any>>}
	 * @throws {Error}
	 * @memberof TodosService
	 * @since 1.0.0
	 */
	public async update(id: number, title: string): Promise<Record<string, any>> {
		try {
			const result = await db.get(
				`UPDATE todos SET title = ? WHERE id = ? RETURNING *`,
				[title, id],
			);

			if (!result || !Object.keys(result).length) {
				throw new Error('Failed to update todo.');
			}

			return {
				id: result.id,
				title: result.title,
				completed: result.completed === 0 ? false : true,
			};
		} catch (err: any) {
			throw new Error(err?.message || 'Failed to update todo.');
		}
	}

	/**
	 * Delete a todo via id.
	 *
	 * @param {number} id
	 * @returns {Promise<boolean>}
	 * @throws {Error}
	 * @memberof TodosService
	 * @since 1.0.0
	 */
	public async deleteTodo(id: number): Promise<boolean> {
		try {
			const result = await db.run(`DELETE FROM todos WHERE id = ?`, [id]);

			return result && result?.changes ? true : false;
		} catch (err: any) {
			throw new Error(err?.message || 'Failed to delete todo.');
		}
	}
}
