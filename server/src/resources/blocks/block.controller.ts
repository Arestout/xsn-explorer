import { NextFunction, Request, Response } from 'express';
import { BlockRepository } from './block.repository';
import { BlockService } from './blocks.service';
import { RpcClient } from '../../lib/wallet/rpcClient';
import { BlockDb } from './interfaces/block.interface';
import { TxService } from './../tx/tx.service';
import { TxRepository } from './../tx/tx.repository';
import DB from './../../database/index';
import { logger } from '../../utils/logger';
import { IBlockController } from './interfaces/blockController.interface';

const rpcClient = new RpcClient('http://user:password@wallet:8332');
const blockRepository = new BlockRepository();
const txRepository = new TxRepository();

export class BlockController implements IBlockController {
  private blockService = new BlockService(blockRepository, rpcClient);
  private txService = new TxService(txRepository, rpcClient);

  public findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      let block: BlockDb;

      if (Number.isNaN(Number(id))) {
        block = await this.blockService.findByHash(id);
      } else {
        block = await this.blockService.findByHeight(id);
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

  public create = async (height: string): Promise<BlockDb> => {
    const transaction = await DB.sequelize.transaction();

    try {
      const block = await this.blockService.findByHeight(height);
      const blockDB = await this.blockService.create(block, transaction);
      await this.txService.create(block, transaction);
      await transaction.commit();

      return blockDB;
    } catch (error) {
      console.log(error);
      logger.error(error.message);
      await transaction.rollback();
      throw error;
    }
  };
}
