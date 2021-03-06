import {IBot} from './bot';

export default abstract class Listener {
    public readonly event: string;
    public bot: IBot | undefined;

    protected constructor(event: string) {
        this.event = event;
    }

    abstract onEvent(...args: unknown[]): Promise<void>;
}
