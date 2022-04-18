import Command from '../../command';
import loadCommands from '../../command-loader';
import { exec } from 'child_process';
import Context from '../../context';

class HotReload extends Command {
  async execute({ bot, message }: Context): Promise<void> {
    try {
      exec('npm run build', async () => {
        bot.commands = await loadCommands();
        await message.channel.send('Reloaded commands.');
      });
    } catch (e) {
      await message.channel.send('Failed to reload commands: ' + e);
    }
  }

  name(): string {
    return 'reload';
  }

  override aliases(): string[] {
    return ['refresh'];
  }

  override description(): string {
    return 'Reloads commands.';
  }

  override isMaintainerOnly(): boolean {
    return true;
  }
}

export default {
  commands: [HotReload]
};
