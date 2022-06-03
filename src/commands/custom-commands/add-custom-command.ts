import Command from '../../command';
import Context from '../../context';

class AddCustomCommand extends Command {
    async execute({bot, message, args}: Context): Promise<void> {
        if (message.guild === null) {
            return;
        }
        const [name, ...parts] = args.split(',');
        const content = parts.join(',').trim();
        const commandName = name.trim();
        if (bot.commands.has(commandName)) {
            await message.channel.send(`Command ${commandName} already exists.`);
            return;
        }
        if (!commandName || !content) {
            await message.channel.send('Invalid command name or content.');
            return;
        }
        if (content.startsWith(bot.trigger)) {
            await message.channel.send('Command content cannot start with the bot trigger.');
            return;
        }

        const customCommand = await bot.repository.createCustomCommand(message.guild.id, commandName, content);
        if (customCommand === undefined) {
            await message.channel.send('Failed to create custom command.');
            return;
        }
        await message.channel.send(`Created custom command ${commandName} with content "${content}".`);
    }

    name(): string {
        return 'add-custom-command';
    }

    aliases(): string[] {
        return ['add-custom', 'add-command'];
    }
}

export default {
    commands: [AddCustomCommand],
};
