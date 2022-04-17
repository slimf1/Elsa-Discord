import { GuildMember } from 'discord.js';
import Command from '../../command';
import Context from '../../context';

export default class Kill extends Command {
  async execute({ message }: Context): Promise<void> {
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
