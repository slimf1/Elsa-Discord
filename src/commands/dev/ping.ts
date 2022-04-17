import Command from '../../command';
import Context from '../../context';

class Ping extends Command {

  async execute({ message }: Context): Promise<void> {
    await message.reply('Pong.');
  }

  name(): string {
    return 'ping';
  }

  override description(): string {
    return 'Returns pong.';
  }
}

export default {
  commands: [Ping]
};
