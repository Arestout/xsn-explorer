import { NextFunction, Request, Response } from 'express';
import { BlockRepository } from './block.repository';
// import { Block } from './block.interface';
import { BlockService } from './blocks.service';
import { RpcClient } from '../../lib/wallet/rpcClient';
import { Block } from './block.interface';
import { TxService } from './../tx/tx.service';
import { TxRepository } from './../tx/tx.repository';
import { AddressService } from './../addresses/address.service';
import { AddressRepository } from './../addresses/address.repository';
import { Tx } from './../tx/tx.interface';

export class BlockController {
  private blockService = new BlockService(new BlockRepository(), new RpcClient('http://user:password@wallet:8332'));
  private txService = new TxService(new TxRepository(), new RpcClient('http://user:password@wallet:8332'));
  private addressService = new AddressService(new AddressRepository(), new RpcClient('http://user:password@wallet:8332'));
  private client = new RpcClient('http://user:password@wallet:8332');

  public getBlockByHash = async (req: Request, res: Response, next: NextFunction) => {
    // res.status(200).send('block');
    try {
      // const { hash } = req.params;
      // console.log('BLOCK', this.blockService);
      // console.log({ hash });
      // const rawTx = await this.client.getRawTransaction('619cd82a50687dcb26776c7b6abdea05deab3a76f8acba955db3465580faef6b');
      // console.log({ rawTx });
      // res.status(200).send(rawTx);

      // const tx = await this.client.getRawTransaction('7a72cc41ea5e7d42da0b10bfbfb158fbbce8efc743c031a9edbc2744c5b1ceed');
      // res.status(200).send(tx);

      const blockData = await this.client.getBlockByHash('a0a42ca53a7d4a1563ee0ca5a02f854b23b4fcd97c72626ce0c51b4b52f6095b');
      // console.log({ blockData });
      const block = await this.addBlockToDb(blockData);

      res.status(200).send(block);
    } catch (error) {
      next(error);
    }
  };

  public addBlockToDb = async (blockData: Block) => {
    const block = await this.blockService.createBlock(blockData);
    const txs: Tx[] = await this.txService.createTx(blockData);
    const address = await this.addressService.createAddress(txs);
    return block;
  };
}
