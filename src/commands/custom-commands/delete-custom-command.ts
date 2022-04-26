import Command from '../../command';
import Context from '../../context';

class DeleteCustomCommand extends Command {
  async execute({ bot, message, args }: Context): Promise<void> {
    if (message.guild === null) {
      return;
    }
    const command = await bot.repository.getCustomCommand(message.guild.id, args);
    if (!command) {
      await message.channel.send('Could not find custom command.');
      return;
    }
    await bot.repository.deleteCustomCommand(message.guild.id, args);
    await message.channel.send(`Deleted custom command ${args}.`);
  }
  name(): string {
    return 'delete-custom-command';
  }
  aliases(): string[] {
    return ['delete-custom', 'delete-command'];
  }
}

export default {
  commands: [DeleteCustomCommand],
};
