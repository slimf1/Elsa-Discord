import Command from '../../command';
import Context from '../../context';
import { Duration } from 'luxon';

class Uptime extends Command {
  async execute({ message, bot }: Context): Promise<void> {
    await message.channel
      .send(`**Uptime:** ${Duration.fromMillis(bot.client.uptime ?? 0).toFormat('hh:mm:ss')}`);
  }
  name(): string {
    return 'uptime';
  }
  override description(): string {
    return 'Shows the bot uptime.';
  }
}

export default {
  commands: [Uptime]
};
