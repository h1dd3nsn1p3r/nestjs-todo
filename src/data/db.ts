import * as sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

// Use a global object to persist the client across module reloads
const globalStore = globalThis as {
	dbClient?: Database | null;
	dbConnection?: Promise<Database> | null;
};

// Singleton database instance (persists across hot reloads)
let client: Database | null = globalStore.dbClient || null;

// Promise to track ongoing initialization (persists across hot reloads)
let clientConnection: Promise<Database> | null =
	globalStore.dbConnection || null;

/**
 * Initialize or reuse the database connection.
 *
 * @returns {Promise<Database>} The database instance.
 * @since 1.0.0
 */
async function initConnection(): Promise<Database> {
	if (client) {
		return client;
	}

	if (clientConnection) {
		return await clientConnection; // Wait for in-progress initialization
	}

	try {
		clientConnection = open({
			filename: './db.sqlite',
			driver: sqlite3.Database,
		});

		globalStore.dbConnection = clientConnection; // Store in global scope

		client = await clientConnection;

		globalStore.dbClient = client; // Persist client in global scope

		clientConnection = null;

		globalStore.dbConnection = null; // Reset after completion

		return client;
	} catch (err: any) {
		clientConnection = null;

		globalStore.dbConnection = null; // Reset on error

		throw new Error(err?.message || 'Failed to connect to the database.');
	}
}

/**
 * Export the database instance as a proxy.
 *
 * @returns {Database} The database instance with lazy initialization.
 * @since 1.0.0
 */
export const db = new Proxy({} as Database, {
	get(_, prop) {
		// Handle method calls (like run, get, all, exec)
		if (['run', 'get', 'all', 'exec'].includes(prop as string)) {
			return async (...args: any[]) => {
				const initializedClient = await initConnection(); // Ensure initialized first

				const method = Reflect.get(initializedClient, prop);

				if (typeof method === 'function') {
					return method.apply(initializedClient, args);
				}

				throw new Error(
					`Property ${String(prop)} is not a function on the database instance.`,
				);
			};
		}

		// For non-method properties, require initialization
		if (!client) {
			throw new Error(
				'Database not yet initialized. Please await db.run(), db.get(), or similar method first.',
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
export async function closeDBConnection(): Promise<void> {
	if (client) {
		await client.close();

		client = null;

		globalStore.dbClient = null; // Clear from global scope
	}
}
