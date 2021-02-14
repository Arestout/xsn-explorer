import request from 'request';
import axios from 'axios';
import { Tx } from '../../resources/tx/tx.interface';
import { Block } from '../../resources/blocks/block.interface';

interface AxiosResponse {
  result: Tx | Block;
}

export class RpcClient {
  private url: string;
  private headers = {
    'Content-Type': 'application/json',
  };

  constructor(url: string) {
    this.url = url;
  }

  async getData(method: string, params: any[] = []): Promise<any> {
    const config = {
      headers: this.headers,
      timeout: 1000,
    };
    const body = JSON.stringify({ jsonrpc: '2.0', method, params });

    try {
      const { data } = await axios.post<AxiosResponse>(this.url, body, config);

      return data.result;
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }

  public getBlockHash = async (height: string): Promise<string> => {
    return await this.getData('getblockhash', [Number(height)]);
  };

  public getBlockByHash = async (hash: string): Promise<Block> => {
    const verbosity = 2;
    return await this.getData('getblock', [hash, verbosity]);
  };

  public getRawTransaction = async (txId: string): Promise<Tx> => {
    return await this.getData('getrawtransaction', [txId, 1]);
  };
}

// const options = {
//   url: this.url,
//   method: 'POST',
//   headers: this.headers,
//   body: JSON.stringify({ jsonrpc: '2.0', method, params }),
// };

// return new Promise((resolve, reject) => {
//   request(options, (error, response, body) => {
//     if (error) {
//       console.error('An error has occurred: ', error);
//       reject(error);
//     }
//     const data = JSON.parse(body);
//     resolve(data.result);
//   });
// });
