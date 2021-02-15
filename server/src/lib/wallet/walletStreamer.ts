import { BlockController } from '../../resources/blocks/block.controller';
import { sleep } from '../../utils/util';
import { RpcClient } from './rpcClient';

export class WalletStreamer {
  private blockHeight: number;
  private blockHeightWallet: number;
  private blockController = new BlockController();
  private timeout: number;
  private rpcClient = new RpcClient('http://user:password@wallet:8332');

  public async start(): Promise<void> {
    await sleep(60000); // 1 min
    await this.getLatestBlockHeight();
    await this.pingWallet();
  }

  private async streamData(height: number): Promise<void> {
    this.compareHeights();
    this.blockHeight += 1;

    try {
      await this.blockController.createBlock(String(height));
    } catch (error) {
      this.blockHeight -= 1;
    }

    setTimeout(async () => await this.streamData(this.blockHeight), this.timeout);
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
      const blockHeightDb: number = await this.blockController.getLatestBlockHeight();
      this.blockHeightWallet = await this.rpcClient.getBlockCount();

      this.blockHeight = blockHeightDb;
    } catch (error) {
      this.blockHeight = 0; // TODO
    }

    this.timeout = 0;
  }

  private async compareHeights(): Promise<void> {
    if (this.blockHeight == this.blockHeightWallet) {
      this.timeout = 1000;
    }
  }
}
