import { Message } from 'discord.js';
import Command from '../../command';
import Context from '../../context';
import Listener from '../../listener';

class AddCustomCommand extends Command {
  async execute({ bot, message, args }: Context): Promise<void> {
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
    if (commandName === undefined || content === undefined) {
      await message.channel.send('Invalid command name or content.');
      return;
    }
    if (content.startsWith(bot.trigger)) {
      await message.channel.send('Command content cannot start with the bot trigger.');
      return;
    }

    const customCommand = await bot.repository.createCustomCommand(
      message.guild.id, commandName, content);
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
    return ['add-custom'];
  }
}

class DeleteCustomCommand extends Command {
  async execute({ bot, message, args }: Context): Promise<void> {
    if (message.guild === null) {
      return;
    }
    const command = await bot.repository.getCustomCommand(message.guild.id, args);
    if (!command) {
      await message.channel.send('Could not find custom command.');
      return;
    }
    await bot.repository.deleteCustomCommand(message.guild.id, args);
    await message.channel.send(`Deleted custom command ${args}.`);
  }
  name(): string {
    return 'delete-custom-command';
  }
  aliases(): string[] {
    return ['delete-custom'];
  }
}

class ListCustomCommand extends Command {
  async execute({ bot, message }: Context): Promise<void> {
    if (message.guild === null) {
      return;
    }
    const commands = await bot.repository.getCustomCommands(message.guild.id);
    if (commands.length === 0) {
      await message.channel.send('No custom commands found.');
      return;
    }
    const responses = commands.map(c => `${c.name}: ${c.content}`);
    await message.channel.send(`Custom commands: \`\`\`${responses.join('\n')}\`\`\``);
  }
  name(): string {
    return 'list-custom-commands';
  }
  aliases(): string[] {
    return ['list-custom'];
  }
}

class CustomCommandListener extends Listener {
  constructor() {
    super('messageCreate');
  }

  async onEvent(...args: unknown[]): Promise<void> {
    const [message] = args as [Message];
    if (message.guild === null) {
      return;
    }
    if (!message.content.startsWith(this.bot?.trigger ?? '')) {
      return;
    }
    if (message.author.id === this.bot?.client.user?.id) {
      return;
    }
    const command = message
      .content
      .substring(this.bot?.trigger?.length ?? 0)
      .split(' ')[0];
    if (this.bot?.commands.has(command)) {
      return;
    }
    const commandArgs = message
      .content
      .substring((this.bot?.trigger?.length ?? 0) + command.length + 1);
    const customCommand = await this.bot?.repository.getCustomCommand(message.guild.id, command);
    if (!customCommand) {
      return;
    }
    await message.channel.send(customCommand.content);
  }
}

export default {
  commands: [AddCustomCommand, DeleteCustomCommand, ListCustomCommand],
  listeners: [CustomCommandListener],
};
