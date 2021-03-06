import request from 'request';
import { Tx } from '../../resources/tx/interfaces/tx.interface';
import { Block } from '../../resources/blocks/interfaces/block.interface';
import HttpException from '../../utils/HttpException';
import { IRpcClient } from './rpcClient.interface';
export class RpcClient implements IRpcClient {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  private async getData(method: string, params: any[] = []): Promise<any> {
    const options = {
      url: this.url,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
      }),
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          console.error('An error has occurred: ', error);
          return reject(error);
        }

        resolve(JSON.parse(body));
      });
    });
  }

  public async ping(): Promise<Record<string, string | null>> {
    const data = await this.getData('ping');
    return data;
  }

  public async getBlockCount(): Promise<number> {
    const data = await this.getData('getblockcount');
    return Number(data.result);
  }

  public async getBlockHash(height: string): Promise<string> {
    const data = await this.getData('getblockhash', [Number(height)]);

    if (data?.error?.code === -5) {
      throw new HttpException(404, 'Block not found');
    }

    return data.result;
  }

  public async getBlockByHash(hash: string): Promise<Block> {
    const verbosity = 2;
    const data = await this.getData('getblock', [hash, verbosity]);

    if (data?.error?.code === -5) {
      throw new HttpException(404, 'Block not found');
    }

    return data.result;
  }

  public async getRawTransaction(txId: string): Promise<Tx> {
    const data = await this.getData('getrawtransaction', [txId, 1]);

    if (data?.error?.code === -5) {
      throw new HttpException(404, 'Transaction not found');
    }

    return data.result;
  }
}
