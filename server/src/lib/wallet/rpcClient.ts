import axios from 'axios';
import { Tx } from '../../resources/tx/tx.interface';
import { Block } from '../../resources/blocks/block.interface';

interface IRpcClient {
  getBlockHash(height: string): Promise<string>;
  getBlockByHash(hash: string): Promise<Block>;
  getRawTransaction(txId: string): Promise<Tx>;
}

export class RpcClient implements IRpcClient {
  private url: string;
  private headers = {
    'Content-Type': 'application/json',
  };

  constructor(url: string) {
    this.url = url;
  }

  private async getData(method: string, params: any[] = []): Promise<any> {
    const config = {
      headers: this.headers,
      timeout: 1000,
    };
    const body = JSON.stringify({ jsonrpc: '2.0', method, params });

    try {
      const { data } = await axios.post(this.url, body, config);

      return data;
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }

  public async ping(): Promise<Record<string, string | null>> {
    return await this.getData('ping');
  }

  public async getBlockHash(height: string): Promise<string> {
    const { result } = await this.getData('getblockhash', [Number(height)]);
    return result;
  }

  public async getBlockByHash(hash: string): Promise<Block> {
    const verbosity = 2;
    const { result } = await this.getData('getblock', [hash, verbosity]);
    return result;
  }

  public async getRawTransaction(txId: string): Promise<Tx> {
    const { result } = await this.getData('getrawtransaction', [txId, 1]);
    return result;
  }
}
