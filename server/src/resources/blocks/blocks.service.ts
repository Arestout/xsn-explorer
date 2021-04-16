import { Block, BlockDTO } from './interfaces/block.interface';
import { Transaction } from 'sequelize/types';
import { IRpcClient } from './../../lib/wallet/rpcClient.interface';
import { IBlockRepository } from './interfaces/blockRepository.interface';

export class BlockService {
  public blockRepository: IBlockRepository;
  public rpcClient: IRpcClient;

  constructor(repository: IBlockRepository, rpcClient: IRpcClient) {
    this.blockRepository = repository;
    this.rpcClient = rpcClient;
  }

  public async getLatestBlockHeight(): Promise<number> {
    return await this.blockRepository.getLatestBlockHeight();
  }

  public async findMany(page: number): Promise<BlockDTO[]> {
    const blocks = await this.blockRepository.findMany(page);

    return blocks;
  }

  public async findByHeight(height: string): Promise<Block> {
    const hash = await this.rpcClient.getBlockHash(height);
    const block = await this.findByHash(hash);

    return block;
  }

  public async findByHash(hash: string): Promise<Block> {
    const block = await this.rpcClient.getBlockByHash(hash);

    return block;
  }

  public async create(block: Block, transaction: Transaction): Promise<BlockDTO> {
    const blockDTO = await this.blockRepository.create(block, transaction);

    return blockDTO;
  }
}
