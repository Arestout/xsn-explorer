import { Block, BlockDTO } from './interfaces/block.interface';
import HttpException from '../../utils/HttpException';
import DB from './../../database/index';
import { isEmpty } from '../../utils/util';
import { Transaction } from 'sequelize/types';
import { IBlockRepository } from './interfaces/blockRepository.interface';
import { RpcClient } from '../../libs/wallet/rpcClient';
import { Tx } from '../tx/interfaces/tx.interface';
import { Vout } from '../tx/vout/vout.interface';

export class BlockRepository implements IBlockRepository {
  protected rpcClient = new RpcClient('http://user:password@wallet:8332');
  protected blocks = DB.Blocks;
  protected txDB = DB.Tx;
  protected addresses = DB.Addresses;
  protected vins = DB.Vin;
  protected vouts = DB.Vout;

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

  public async create(block: Block): Promise<BlockDTO> {
    const transaction = await DB.sequelize.transaction();

    try {
      const findBlock = await this.blocks.findOne({ where: { hash: block.hash } });
      if (findBlock) throw new Error(`The block with hash ${block.hash} already exists`);

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

      // TX
      for (const blockTx of block.tx) {
        const tx: Tx = await this.rpcClient.getRawTransaction(blockTx.txid);

        await this.txDB.create(
          {
            txid: tx.txid,
            blockhash: tx.blockhash,
          },
          {
            transaction,
          },
        );

        // Address
        const createValues = async balance => {
          const [address, value] = balance;
          if (value === 0) {
            return;
          }

          await this.addresses.create(
            {
              tx: tx.txid,
              address,
              time: tx.time,
              value,
            },
            {
              transaction,
            },
          );
        };
        const balances = {};
        await this.createVin(tx, balances, transaction);
        await this.createVout(tx, balances, transaction);
        await Promise.all(Object.entries(balances).map(createValues));
      }

      await transaction.commit();
      return blockDTO;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private async createVin(tx: Tx, balances, transaction: Transaction) {
    for (const vin of tx.vin) {
      if (vin.txid) {
        await this.vins.create(
          {
            txid: vin.txid,
            vout: Number(vin.vout),
            tx: tx.txid,
          },
          {
            transaction,
          },
        );

        let vout: Vout = await this.vouts.findOne({
          where: {
            tx: vin.txid,
            n: vin.vout,
          },
          raw: true,
        });

        if (isEmpty(vout)) {
          const tx = await this.rpcClient.getRawTransaction(vin.txid);
          vout = tx.vout.find(vout => vout.n === vin.vout);
          vout.value = Math.round(vout.value * 1e8);
        }

        const address = vout?.scriptPubKey?.addresses[0] || vout.address;
        const voutValue = vout.value * -1;

        balances[address] = balances[address] ? balances[address] + voutValue : voutValue;
      }
    }
  }

  private async createVout(tx: Tx, balances, transaction: Transaction) {
    for (const vout of tx.vout) {
      if (vout?.scriptPubKey?.addresses) {
        if (vout.value >= 15000) {
          // TODO sendMessage
        }

        if (vout.scriptPubKey.addresses[0] === 'TODO') {
          // TODO sendMessage
        }

        const voutValue = Math.round(vout.value * 1e8);

        await this.vouts.create(
          {
            value: voutValue,
            n: vout.n,
            type: vout.scriptPubKey.type,
            tx: tx.txid,
            address: vout.scriptPubKey.addresses[0],
          },
          {
            transaction,
          },
        );

        const address = vout.scriptPubKey.addresses[0];

        balances[address] = balances[address] ? balances[address] + voutValue : voutValue;
      }
    }
  }
}
