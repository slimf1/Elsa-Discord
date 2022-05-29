import Command from '../../command';
import Context from '../../context';

class CommandList extends Command {
    async execute({message, bot}: Context): Promise<void> {
        const commands = new Map<string, Command>();
        bot.commands.forEach(c => commands.set(c.name(), c));
        let reply = '**Commandes disponibles:**\n';
        for (const [name, command] of commands) {
            reply += `\`${name}\``;
            if (command.description().length) {
                reply += `: ${command.description()}`;
            }
            if (command.aliases().length) {
                reply += ` _Aliases_: ${command.aliases().join(', ')}`;
            }
            reply += '\n';
        }
        await message.channel.send(reply);
    }

    name(): string {
        return 'command-list';
    }

    override description(): string {
        return 'Lists all commands.';
    }

    override aliases(): string[] {
        return ['commands', 'list'];
    }
}

export default {
    commands: [CommandList]
};
