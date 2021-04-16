import { Block, BlockDTO } from './interfaces/block.interface';
import HttpException from '../../utils/HttpException';
import DB from './../../database/index';
import { isEmpty } from '../../utils/util';
import { Transaction } from 'sequelize/types';
import { IBlockRepository } from './interfaces/blockRepository.interface';

export class BlockRepository implements IBlockRepository {
  public blocks = DB.Blocks;

  public async findMany(page = 1): Promise<BlockDTO[]> {
    const limit = 50;
    const blocks = await this.blocks.findAll({
      limit,
      offset: page * limit,
    });

    return blocks;
  }

  public async getLatestBlockHeight(): Promise<number> {
    const blockDTO = await this.blocks.findOne({
      order: [['createdAt', 'DESC']],
    });

    if (isEmpty(blockDTO)) {
      throw new HttpException(404, `No blocks found`);
    }

    return blockDTO.height;
  }

  public async create(block: Block, transaction: Transaction): Promise<BlockDTO> {
    const findBlock = await this.blocks.findOne({ where: { hash: block.hash } });
    if (findBlock) throw new HttpException(409, `The block with hash ${block.hash} already exists`);

    const blockDTO = await this.blocks.create(
      {
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
      },
      {
        transaction,
      },
    );

    return blockDTO;
  }
}
