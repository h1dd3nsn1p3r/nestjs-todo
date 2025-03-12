import { open } from 'sqlite';
import * as sqlite3 from 'sqlite3';

/**
 * Initialize the database connection.
 *
 * @since 1.0.0
 */
let client: import('sqlite').Database;

(async () => {
	try {
		client = await open({
			filename: './db.sqlite',
			driver: sqlite3.Database,
		});

		console.log('Connected to SQLite database and initialized todos table.');
	} catch (err: any) {
		throw new Error(err?.message || 'Failed to connect to the database.');
	}
})();

/**
 * Export the database instance (it will be set after the async initialization)
 *
 * @returns {import('sqlite').Database} The database instance.
 * @since 1.0.0
 */
export const db = new Proxy({} as import('sqlite').Database, {
	get(_, prop) {
		if (!client) {
			throw new Error(
				'Database not yet initialized. Please wait for initialization.',
			);
		}
		return Reflect.get(client, prop);
	},
});

/**
 * Close the database connection.
 *
 * @returns {Promise<void>} A promise that resolves when the connection is closed.
 * @since 1.0.0
 */
export async function closeDatabaseConnection(): Promise<void> {
	if (client) {
		await client.close();
		console.log('Database connection closed.');
	}
}
