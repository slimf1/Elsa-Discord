import Command from '../../command';
import Context from '../../context';

class Eval extends Command {
    async execute({message, args, bot}: Context): Promise<void> {
        try {
            const result = eval(args);
            await message.reply(`Result: ${result}`);
        } catch (error) {
            await message.reply(`Error: ${error}`);
        }
    }

    name(): string {
        return 'eval';
    }

    override isMaintainerOnly(): boolean {
        return true;
    }
}

export default {
    commands: [Eval]
};
