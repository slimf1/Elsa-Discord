import { Message } from 'discord.js';
import { IBot } from '../bot';
import Command from '../command';

export default class Elections extends Command {
  async execute(bot: IBot, message: Message, args: string): Promise<void> {
    let results: Map<string, number> = new Map();
    let sum = 0;
    for (const candidate of args.split(',')) {
      const part = Math.random();
      results.set(candidate.trim(), part);
      sum += part;
    }
    results = new Map([...results].sort((a, b) => b[1] - a[1]));
    const response = [...results.entries()].map(([candidate, part]) =>
      `${candidate}: **${(100 * part / sum).toFixed(2)}%**`
    );
    await message.channel.send('Results: ' + response.join(' '));
  }

  name(): string {
    return 'elections';
  }

  override description(): string {
    return 'Returns elections.';
  }
}
