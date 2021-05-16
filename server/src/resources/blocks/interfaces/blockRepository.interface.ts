import { Block, BlockDTO } from './block.interface';

export interface IBlockRepository {
  findMany(page: number): Promise<BlockDTO[]>;
  getLatestBlockHeight(): Promise<number>;
  create(block: Block): Promise<BlockDTO>;
}
