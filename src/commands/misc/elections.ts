import Command from '../../command';
import Context from '../../context';

export default class Elections extends Command {
  async execute({ message, args }: Context): Promise<void> {
    const results: Map<string, number> = new Map();
    let sum = 0;
    for (const candidate of args.split(',')) {
      const part = Math.random();
      results.set(candidate.trim(), part);
      sum += part;
    }
    const responses = [...results]
      .sort((a, b) => b[1] - a[1])
      .map(([candidate, part]) =>
        `${candidate}: **${(100 * part / sum).toFixed(2)}%**`);
    await message.channel.send('Results: ' + responses.join(' '));
  }

  name(): string {
    return 'elections';
  }

  override description(): string {
    return 'Returns elections.';
  }
}
