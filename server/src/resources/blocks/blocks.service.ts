import { Block, BlockDb } from './block.interface';
import { BlockRepository } from './block.repository';
import { RpcClient } from '../../lib/wallet/rpcClient';

export class BlockService {
  public blockRepository: BlockRepository;
  public rpcClient: RpcClient;

  constructor(repository, rpcClient) {
    this.blockRepository = repository;
    this.rpcClient = rpcClient;
  }

  public async getBlockByHash(hash: string): Promise<Block> {
    const block = await this.rpcClient.getBlockByHash(hash);

    return block;
  }

  public async createBlock(block: Block): Promise<BlockDb> {
    const blockDb: BlockDb = await this.blockRepository.createBlock(block);

    return blockDb;
  }
}
