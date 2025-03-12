import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	constructor() {}

	/**
	 * Get the date and time in string format.
	 *
	 * @returns {string} The date and time in string format.
	 * @since 1.0.0
	 */
	public index(): string {
		return new Date().toTimeString();
	}
}
