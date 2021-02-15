import { Router } from 'express';

import { Routes } from '../../interfaces/routes.interface';
import validationMiddleware from '../../middlewares/validation.middleware';
import { TxController } from './tx.controller';
import { ValidateTxId } from './tx.validate';

export class TxRoute implements Routes {
  public path = '/transactions';
  public router = Router();
  public txController = new TxController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, validationMiddleware(ValidateTxId, 'params'), this.txController.getTx);
  }
}
