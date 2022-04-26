import { Message } from 'discord.js';
import jsep, { Expression } from 'jsep';
import { DateTime } from 'luxon';
import Command from '../../command';
import Context from '../../context';
import Listener from '../../listener';
import { choice } from '../../utils/rand';

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
    if (!commandName || !content) {
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
    return ['add-custom', 'add-command'];
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
    return ['delete-custom', 'delete-command'];
  }
}

type FunctionMap = {
  [key: string]: CallableFunction;
};

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
    const responses = commands.map(c => `${c.name}: ${c.content}. ` +
      `Créée le ${DateTime.fromFormat(c.createdAt.toString(), 'yyyy-MM-dd')
        .toFormat('dd/MM/yyyy')}`);
    await message.channel.send(`Custom commands: \`\`\`${responses.join('\n\n')}\`\`\``);
  }
  name(): string {
    return 'list-custom-commands';
  }
  aliases(): string[] {
    return ['list-custom', 'list-command'];
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

    const predefinedFunctions: FunctionMap = {
      'choice': (...args: string[]): string => choice(args),
      'dice': (a: number, b: number): number => Math.floor(Math.random() * (b - a + 1)) + a,
      'repeat': (expression: string, count: number): string => {
        const result = new Array(count).map(() => {
          const node = jsep(expression);
          const result = evaluate(node);
          return result;
        }).join('');
        return result;
      }
    };

    const binaryOperators: FunctionMap = {
      '+': (a: number, b: number): number => a + b,
      '-': (a: number, b: number): number => a - b,
      '*': (a: number, b: number): number => a * b,
      '/': (a: number, b: number): number => a / b,
      '%': (a: number, b: number): number => a % b,
      '**': (a: number, b: number): number => a ** b,
    };

    const predefinedIdentifiers: FunctionMap = {
      'command': (): string => command,
      'author': (): string => message.author.toString(),
      'channel': (): string => message.channel.toString(),
      'guild': (): string => message.guild!.toString(),
      'args': (): string => commandArgs,
      'randMember': (): string => choice([...message.guild!.members.cache.values()]
        .map(t => t?.displayName ?? '')).toString(),
    };``

    const evaluate = (node: Expression): unknown => {
      if (node.type === 'Literal') {
        return node.value;
      }
      if (node.type === 'CallExpression') {
        const functionNode = node.callee as Expression;
        const functionName = functionNode.name as string;
        const functionArgs = (node!.arguments as Expression[]).map(evaluate);
        if (predefinedFunctions[functionName]) {
          return predefinedFunctions[functionName](...functionArgs);
        }
        throw new Error(`Could not find function ${functionName}`);
      }
      if (node.type === 'BinaryExpression') {
        const left = evaluate(node.left as Expression);
        const right = evaluate(node.right as Expression);
        const operator = node.operator as string;
        if (binaryOperators[operator]) {
          return binaryOperators[operator](left, right);
        }
        throw new Error(`Could not evaluate binary expression ${node.operator}`);
      }
      if (node.type === 'Identifier') {
        const identifier = node.name as string;
        if (predefinedIdentifiers[identifier]) {
          return predefinedIdentifiers[identifier]();
        }
        throw new Error(`Could not find identifier ${identifier}`);
      }
    };

    const customCommand = await this.bot?.repository.getCustomCommand(message.guild.id, command);
    if (!customCommand) {
      return;
    }
    try {
      let content = customCommand.content;
      const matches = content.match(/({[^}]+})/g) ?? [];
      for (const match of matches) {
        const expression = match.substring(1, match.length - 1);
        const node = jsep(expression);
        const result = evaluate(node);
        content = content.replace(match, (result as object).toString());
      }
      await message.channel.send(content);
    } catch (error) {
      await message.channel
        .send(`Error while evaluating custom command ${command}: \`\`\`${error}\`\`\``);
    }
  }
}

export default {
  commands: [AddCustomCommand, DeleteCustomCommand, ListCustomCommand],
  listeners: [CustomCommandListener],
};
