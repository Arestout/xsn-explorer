import { NextFunction, Request, Response } from 'express';
import { TxService } from './tx.service';
import { TxRepository } from './tx.repository';
import { RpcClient } from '../../lib/wallet/rpcClient';

const rpcClient = new RpcClient('http://user:password@wallet:8332');
const txRepository = new TxRepository();

export class TxController {
  private txService = new TxService(txRepository, rpcClient);

  public getTx = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const tx = await this.txService.getTx(id);

      res.status(200).json(tx);
    } catch (error) {
      next(error);
    }
  };
}
