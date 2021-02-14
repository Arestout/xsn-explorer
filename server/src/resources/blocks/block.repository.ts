import { Block, BlockDb } from './block.interface';
import HttpException from '../../utils/HttpException';
import DB from './../../database/index';

export class BlockRepository {
  public blocks = DB.Blocks;

  public async createBlock(block: Block): Promise<BlockDb> {
    const findBlock: BlockDb = await this.blocks.findOne({ where: { hash: block.hash } });
    if (findBlock) throw new HttpException(409, `The block with hash ${block.hash} already exists`);

    const blockDB: BlockDb = await this.blocks.create({
      hash: block.hash,
      size: block.size,
      height: block.height,
      version: block.version,
      time: block.time,
      mediantime: block.mediantime,
      nonce: block.nonce,
      bits: block.bits,
      difficulty: block.difficulty,
      chainwork: block.chainwork,
      tposcontract: block.tposcontract,
      nextblockhash: block.nextblockhash,
      previousblockhash: block.previousblockhash,
    });

    return blockDB;
  }
}
