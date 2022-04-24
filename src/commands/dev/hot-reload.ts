import Command from '../../command';
import { loadPlugins } from '../../command-loader';
import Context from '../../context';
import { bash } from '../../utils';

class HotReload extends Command {
  async execute({ bot, message }: Context): Promise<void> {
    try {
      await bash('npm run build');
      const [commands, listeners] = await loadPlugins();
      bot.commands = commands;
      bot.removeAllListeners();
      bot.addListeners(listeners);
      await message.channel.send('Reloaded commands.');
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
