import { Router } from 'express';

import { Routes } from '../../interfaces/routes.interface';
import { AddressController } from './address.controller';

export class AddressRoute implements Routes {
  public path = '/addresses';
  public router = Router();
  public addressController = new AddressController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:address`, this.addressController.findOne);
  }
}
