import Command from '../../command';
import loadCommands from '../../command-loader';
import { exec } from 'child_process';
import Context from '../../context';

export default class HotReload extends Command {
  async execute({ bot, message }: Context): Promise<void> {
    try {
      exec('npm run build', async () => {
        bot.commands = await loadCommands();
        await message.reply('Reloaded commands.');
      });
    } catch (e) {
      await message.reply('Failed to reload commands: ' + e);
    }
  }

  name(): string {
    return 'reload';
  }

  override description(): string {
    return 'Reloads commands.';
  }
}
