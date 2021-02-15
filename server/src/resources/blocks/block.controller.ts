import { NextFunction, Request, Response } from 'express';
import { BlockRepository } from './block.repository';
import { BlockService } from './blocks.service';
import { RpcClient } from '../../lib/wallet/rpcClient';
import { Block } from './block.interface';
import { TxService } from './../tx/tx.service';
import { TxRepository } from './../tx/tx.repository';
import { AddressService } from './../addresses/address.service';
import { AddressRepository } from './../addresses/address.repository';
import { Tx } from './../tx/tx.interface';

const rpcClient = new RpcClient('http://user:password@wallet:8332');
const blockRepository = new BlockRepository();
const txRepository = new TxRepository();
const addressRepository = new AddressRepository();
export class BlockController {
  private blockService = new BlockService(blockRepository, rpcClient);
  private txService = new TxService(txRepository, rpcClient);
  private addressService = new AddressService(addressRepository, rpcClient);
  private client = rpcClient;

  public async test(req: Request, res: Response, next: NextFunction) {
    // // const tx = await this.client.getRawTransaction('7a72cc41ea5e7d42da0b10bfbfb158fbbce8efc743c031a9edbc2744c5b1ceed');
    // // res.status(200).send(tx);
    // const blockData = await this.client.getBlockByHash('a0a42ca53a7d4a1563ee0ca5a02f854b23b4fcd97c72626ce0c51b4b52f6095b');
    // // console.log({ blockData });
    // const block = await this.createBlock(blockData);
    // res.status(200).send(block);
  }

  public async getBlockByHeight(req: Request, res: Response, next: NextFunction) {
    const { height } = req.params;
    const block = await this.blockService.getBlockByHeight(height);

    res.status(200).json(block);
  }

  public getBlockByHash = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { hash } = req.params;
      const block = await this.client.getBlockByHash(hash);

      res.status(200).json(block);
    } catch (error) {
      next(error);
    }
  };

  public createBlock = async (height: string) => {
    try {
      const block = await this.blockService.getBlockByHeight(height);
      const blockDB = await this.blockService.createBlock(block);
      const txs: Tx[] = await this.txService.createTx(block);
      const address = await this.addressService.createAddress(txs);
      return blockDB;
    } catch (error) {
      console.log(error); // TODO
    }
  };
}
