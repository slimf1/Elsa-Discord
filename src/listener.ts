export default abstract class Listener {
  public readonly event: string;

  constructor(event: string) {
    this.event = event;
  }

  abstract onEvent(...args: unknown[]): Promise<void>;
}
