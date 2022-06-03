import Command from '../../command';
import Context from '../../context';
import {parseCustomCommand} from './custom-command-listener';
import {choice} from '../../utils/rand';

class RandomCustomCommand extends Command {
    async execute({bot, message, args}: Context): Promise<void> {
        const customCommands = await bot.repository.getCustomCommands(message.guildId!);
        const chosenCommand = choice(customCommands);
        message.content = `${bot.trigger}${chosenCommand.name} ${args}`;
        return parseCustomCommand(bot, message);
    }

    name(): string {
        return 'random-custom';
    }

    aliases(): string[] {
        return ['randcom', 'randomcommand', 'random-command'];
    }
}

export default {
    commands: [RandomCustomCommand]
};
