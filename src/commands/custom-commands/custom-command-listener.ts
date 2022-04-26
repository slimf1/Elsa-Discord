import { Message } from 'discord.js';
import jsep, { Expression } from 'jsep';
import Listener from '../../listener';
import { choice } from '../../utils/rand';

type FunctionMap = {
  [key: string]: CallableFunction;
};

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
      'repeat': (expr: string, count: number): string => new Array(count).fill(expr).join('')
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
    };

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
  listeners: [CustomCommandListener],
};
