import { Transaction } from 'sequelize/types';
import { Block, BlockDb } from './block.interface';

export interface IBlockRepository {
  getLatestBlockHeight(): Promise<number>;
  create(block: Block, transaction: Transaction): Promise<BlockDb>;
}
