import Command from '../../command';
import Context from '../../context';

class Kill extends Command {
  async execute({ message }: Context): Promise<void> {
    await message.reply('Killing bot...');
    process.exit(0);
  }
  name(): string {
    return 'kill';
  }
  override isMaintainerOnly(): boolean {
    return true;
  }
}

export default {
  commands: [Kill]
};
