import { BlockDTO } from './block.interface';

export interface IBlockController {
  getLatestBlockHeight(): Promise<number>;
  create(height: string): Promise<BlockDTO>;
}
