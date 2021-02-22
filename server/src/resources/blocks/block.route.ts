import { Router } from 'express';

import { Routes } from '../../interfaces/routes.interface';
import validationMiddleware from '../../middlewares/validation.middleware';
import { BlockController } from './block.controller';
import { ValidateBlockId } from './block.validate';

export class BlocksRoute implements Routes {
  public path = '/blocks';
  public router = Router();
  public blockController = new BlockController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, validationMiddleware(ValidateBlockId, 'params'), this.blockController.findOne);
  }
}
