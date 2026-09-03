import { Router } from 'express';
import { IReminderLogController } from '../controllers/interface/reminderLog.controller.interface.js';
import {
  reminderLogIdParamsSchema,
  reminderLogQuerySchema,
} from '../validators/reminderLog.validators.js';
import { validate } from '../middleware/zod.middleware.js';

export class ReminderLogRoute {
  public readonly router: Router;

  constructor(private readonly ReminderLogController: IReminderLogController) {
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/',
      validate({ query: reminderLogQuerySchema }),
      this.ReminderLogController.getAllReminderLogs.bind(
        this.ReminderLogController,
      ),
    );

    this.router.get(
      '/:id',
      validate({ params: reminderLogIdParamsSchema }),
      this.ReminderLogController.getSingleReminderLog.bind(
        this.ReminderLogController,
      ),
    );
  }
}
