import { NextFunction, Request, Response } from 'express';
import { AddressRepository } from './address.repository';
import { AddressService } from './address.service';
import { RpcClient } from '../../lib/wallet/rpcClient';

const rpcClient = new RpcClient('http://user:password@wallet:8332');
const addressRepository = new AddressRepository();

export class AddressController {
  private addressService = new AddressService(addressRepository, rpcClient);

  public findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;
      const addressDb = await this.addressService.findOne(address);

      res.status(200).json(addressDb);
    } catch (error) {
      next(error);
    }
  };
}
