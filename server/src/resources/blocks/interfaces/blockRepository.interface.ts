import { Transaction } from 'sequelize/types';
import { Block, BlockDTO } from './block.interface';

export interface IBlockRepository {
  findMany(page: number): Promise<BlockDTO[]>;
  getLatestBlockHeight(): Promise<number>;
  create(block: Block, transaction: Transaction): Promise<BlockDTO>;
}
