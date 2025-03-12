import { Controller, Get, HttpCode, Req, Res } from '@nestjs/common';
import { AppService } from '@/app.service';

import type { Request, Response } from 'express';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	/**
	 * HTTP GET /
	 *
	 * Get handler for the root path.
	 *
	 * @returns {Response} The response object.
	 * @memberof AppController
	 * @since 1.0.0
	 */
	@Get()
	@HttpCode(200)
	index(@Req() req: Request, @Res() res: Response): Response {
		const date = this.appService.index();
		return res.json({ status: true, message: 'Hello World! - ' + date });
	}
}
