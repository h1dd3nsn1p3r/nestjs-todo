import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from '@/app.module';
import { db, closeDBConnection } from '@/data/db';

async function runApp() {
	const app = await NestFactory.create(AppModule);

	const port = app.get(ConfigService).get<number>('config.env.PORT') as number;

	const env = app.get(ConfigService).get<string>('config.env.ENV') as string;

	// Explicitly initialize the database connection.
	await db.run(`SELECT 1`);

	await app.listen(port, (): void => {
		console.log(`[🚀 Server]: running on port ${port} in ${env} mode!`);
	});

	/**
	 * Clean up resources when the application is closed.
	 *
	 * @since 1.0.0
	 */
	process.on('SIGINT', async () => {
		await app.close();
		closeDBConnection();
	});

	process.on('SIGTERM', async () => {
		await app.close();
		closeDBConnection();
	});
}
runApp();
