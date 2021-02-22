import { logger } from '../../utils/logger';
import { sleep } from '../../utils/util';
import { IRpcClient } from './rpcClient.interface';
import { IBlockController } from './../../resources/blocks/interfaces/blockController.interface';

export class WalletStreamer {
  private blockHeight: number;
  private timeout = 20;
  private blockController: IBlockController;
  private rpcClient: IRpcClient;

  public constructor(rpcClient: IRpcClient, blockController: IBlockController) {
    this.rpcClient = rpcClient;
    this.blockController = blockController;
  }

  public async start(): Promise<void> {
    await sleep(60000); // 1 min
    await this.getLatestBlockHeight();
    await this.pingWallet();
  }

  private async streamData(height: number): Promise<void> {
    try {
      await this.blockController.create(String(height));
      this.blockHeight += 1;
    } catch (error) {
      logger.error(error.message);
      if (error.status === 409) {
        this.blockHeight += 1;
      }
    }

    setTimeout(async () => await this.streamData(this.blockHeight), this.timeout);
  }

  private async pingWallet(): Promise<void> {
    const response = await this.rpcClient.ping();
    if (response?.error === null) {
      return await this.streamData(this.blockHeight);
    }

    setTimeout(async () => await this.pingWallet(), 1000);
  }

  private async getLatestBlockHeight(): Promise<void> {
    try {
      const blockHeightDb: number = await this.blockController.getLatestBlockHeight();
      this.blockHeight = blockHeightDb + 1;
    } catch (error) {
      this.blockHeight = 1; // TODO
    }
  }
}
