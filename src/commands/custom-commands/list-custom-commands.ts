import { DateTime } from 'luxon';
import Command from '../../command';
import Context from '../../context';

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

export default {
  commands: [ListCustomCommand],
};
