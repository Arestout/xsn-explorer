export class Lock {
  private active = false;
  private queue = [];

  public enter(): Promise<void> {
    return new Promise(resolve => {
      const start = () => {
        this.active = true;
        resolve();
      };
      if (!this.active) {
        start();
        return;
      }
      this.queue.push(start);
    });
  }

  public leave(): Promise<void> {
    if (!this.active) return;
    this.active = false;
    const next = this.queue.pop();
    if (next) next();
  }
}
