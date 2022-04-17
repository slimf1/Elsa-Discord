import { GuildMember } from 'discord.js';
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
  override canExecute(member: GuildMember | null): boolean {
    return super.canExecute(member)
      && member?.id === process.env.MAINTAINER;
  }
}

export default {
  commands: [Kill]
};
