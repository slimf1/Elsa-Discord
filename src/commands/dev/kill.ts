import { GuildMember, Message } from 'discord.js';
import { IBot } from '../../bot';
import Command from '../../command';

export default class Kill extends Command {
  async execute(bot: IBot, message: Message): Promise<void> {
    await message.reply('Killing bot...');
    process.exit(0);
  }
  name(): string {
    return 'kill';
  }
  override canExecute(member: GuildMember | null): boolean {
    return super.canExecute(member)
      && member?.id === '303548403520897025'; // TODO: parameterize this value
  }
}
