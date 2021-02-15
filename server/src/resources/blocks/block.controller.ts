import { NextFunction, Request, Response } from 'express';
import { BlockRepository } from './block.repository';
import { BlockService } from './blocks.service';
import { RpcClient } from '../../lib/wallet/rpcClient';
import { BlockDb } from './block.interface';
import { TxService } from './../tx/tx.service';
import { TxRepository } from './../tx/tx.repository';
import { AddressService } from './../addresses/address.service';
import { AddressRepository } from './../addresses/address.repository';
import { Tx } from './../tx/tx.interface';
import DB from './../../database/index';

const rpcClient = new RpcClient('http://user:password@wallet:8332');
const blockRepository = new BlockRepository();
const txRepository = new TxRepository();
const addressRepository = new AddressRepository();
export class BlockController {
  private blockService = new BlockService(blockRepository, rpcClient);
  private txService = new TxService(txRepository, rpcClient);
  private addressService = new AddressService(addressRepository, rpcClient);

  public getBlock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      let block: BlockDb;

      if (Number.isNaN(Number(id))) {
        block = await this.blockService.getBlockByHash(id);
      } else {
        block = await this.blockService.getBlockByHeight(id);
      }

      res.status(200).json(block);
    } catch (error) {
      next(error);
    }
  };

  public async getLatestBlockHeight(): Promise<number> {
    const blockHeight = await this.blockService.getLatestBlockHeight();

    return blockHeight;
  }

  public createBlock = async (height: string) => {
    const transaction = await DB.sequelize.transaction();

    try {
      const block = await this.blockService.getBlockByHeight(height);
      const blockDB = await this.blockService.createBlock(block, transaction);
      const txs: Tx[] = await this.txService.createTx(block, transaction);
      await this.addressService.createAddress(txs, transaction);

      await transaction.commit();
      return blockDB;
    } catch (error) {
      console.log(error); // TODO
      await transaction.rollback();
      throw error;
    }
  };
}
