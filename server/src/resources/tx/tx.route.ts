import { Router } from 'express';

import { Routes } from '../../interfaces/routes.interface';
import { TxController } from './tx.controller';

export class TxRoute implements Routes {
  public path = '/transactions';
  public router = Router();
  public txController = new TxController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, this.txController.getTx);
  }
}
