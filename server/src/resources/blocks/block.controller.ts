import { NextFunction, Request, Response } from 'express';
import { BlockRepository } from './block.repository';
import { BlockService } from './blocks.service';
import { RpcClient } from '../../libs/wallet/rpcClient';
import { BlockDTO } from './interfaces/block.interface';
import { logger } from '../../utils/logger';
import { IBlockController } from './interfaces/blockController.interface';

const rpcClient = new RpcClient('http://user:password@wallet:8332');
const blockRepository = new BlockRepository();

export class BlockController implements IBlockController {
  private blockService = new BlockService(blockRepository, rpcClient);

  public async findMany(req: Request, res: Response, next: NextFunction) {
    try {
      const { page } = req.query;
      const blocks = await this.blockService.findMany(Number(page));

      res.status(200).json(blocks);
    } catch (error) {
      next(error);
    }
  }

  public findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      let blockDTO: BlockDTO;

      if (Number.isNaN(Number(id))) {
        blockDTO = await this.blockService.findByHash(id);
      } else {
        blockDTO = await this.blockService.findByHeight(id);
      }

      res.status(200).json(blockDTO);
    } catch (error) {
      next(error);
    }
  };

  public async getLatestBlockHeight(): Promise<number> {
    const blockHeight = await this.blockService.getLatestBlockHeight();

    return blockHeight;
  }

  public create = async (height: string): Promise<BlockDTO> => {
    try {
      const blockDB: BlockDTO = await this.blockService.create(height);

      return blockDB;
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  };
}
