import Command from '../../command';
import Context from '../../context';

class Timer extends Command {
    async execute({args, message}: Context): Promise<void> {
        const minutes = new Number(args);
    }


    name(): string {
        return 'timer';
    }
}

export default {
    commands: [Timer]
};
