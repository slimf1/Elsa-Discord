import { exec } from 'child_process';
import { GuildMember } from 'discord.js';
import Command from '../../command';
import Context from '../../context';

class Update extends Command {
  async execute({ message }: Context): Promise<void> {
    exec('git pull origin master', async (err, stdout, stderr) => {
      if (err) {
        await message.reply(`Error: ${err}`);
        return;
      }
      await message.channel.send('Pull successful :');
      await message.channel.send(`
        \`\`\`
        ${stdout}
        ${stderr}
        \`\`\`
      `);
    });
  }
  name(): string {
    return 'update';
  }
  override canExecute(member: GuildMember | null): boolean {
    return super.canExecute(member)
      && member?.id === process.env.MAINTAINER;
  }
}

export default {
  commands: [Update]
};
