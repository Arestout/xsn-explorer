import { BlockController } from '../../resources/blocks/block.controller';

export class WalletStreamer {
  private blockHeight: number;
  private blockController = new BlockController();

  public async start(): Promise<void> {
    await this.getLatestBlockHeight();
    await this.streamData();
  }

  private async streamData(): Promise<void> {
    try {
      this.blockHeight += 1;
      await this.blockController.createBlock(String(this.blockHeight));
    } catch (error) {
      throw new Error(error.message);
    }

    setTimeout(async () => await this.streamData(), 1000);
  }

  private async getLatestBlockHeight(): Promise<void> {
    this.blockHeight = 0;
  }
}
