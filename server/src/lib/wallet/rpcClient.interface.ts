export interface IRpcClient {
  ping(): Promise<Record<string, string | null>>;
  getBlockCount(): Promise<number>;
  getBlockHash(height: string): Promise<string>;
  getBlockByHash(hash: string): Promise<Block>;
  getRawTransaction(txId: string): Promise<Tx>;
}
