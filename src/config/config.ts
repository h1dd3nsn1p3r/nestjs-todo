import { registerAs } from '@nestjs/config';

interface EnvConfig {
	ENV: string;
	PORT: number;
}

interface AppConfig {
	logging: boolean;
	cache: boolean;
}

interface Config {
	env: EnvConfig;
	app: AppConfig;
}

export const appConfig: Config = {
	env: {
		/**
		 * Node environment.
		 */
		ENV: process.env.NODE_ENV || 'development',
		/**
		 * Port to run the server.
		 */
		PORT: Number(process.env.PORT) || 3000,
	},
	app: {
		/**
		 * Enable or disable redis cache (Demo purpose)
		 */
		cache: true,
		/**
		 * Enable or disable logging (Demo purpose)
		 */
		logging: true,
	},
};

export default registerAs('config', () => appConfig);
