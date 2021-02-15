import { BlockController } from '../../resources/blocks/block.controller';
import { sleep } from '../../utils/util';
import { RpcClient } from './rpcClient';

export class WalletStreamer {
  private blockHeight: number;
  private blockController = new BlockController();
  private rpcClient = new RpcClient('http://user:password@wallet:8332');

  public async start(): Promise<void> {
    await sleep(60000); // 1 min
    await this.getLatestBlockHeight();
    await this.pingWallet();
  }

  private async streamData(height: number): Promise<void> {
    try {
      await this.blockController.createBlock(String(height));
      this.blockHeight += 1;
      setTimeout(async () => await this.streamData(this.blockHeight), 1000);
    } catch (error) {
      setTimeout(async () => await this.streamData(this.blockHeight), 5000);
    }
  }

  private async pingWallet(): Promise<void> {
    const response = await this.rpcClient.ping();

    if (response?.error === null) {
      await this.streamData(this.blockHeight + 1);
      return;
    }

    setTimeout(async () => await this.pingWallet(), 1000);
  }

  private async getLatestBlockHeight(): Promise<void> {
    try {
      const blockHeight = await this.blockController.getLatestBlockHeight();
      console.log({ blockHeight });
      this.blockHeight = blockHeight;
    } catch (error) {
      this.blockHeight = 0; // TODO
    }
  }
}
