import { Router } from 'express';

import { Routes } from '../../interfaces/routes.interface';
import { BlockController } from './block.controller';

export class BlocksRoute implements Routes {
  public path = '/blocks';
  public router = Router();
  public blockController = new BlockController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, this.blockController.getBlock);
  }
}
