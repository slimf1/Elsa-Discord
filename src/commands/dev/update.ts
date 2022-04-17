import { exec } from 'child_process';
import { GuildMember, Message } from 'discord.js';
import { IBot } from '../../bot';
import Command from '../../command';

export default class Update extends Command {
  async execute(bot: IBot, message: Message): Promise<void> {
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
      && member?.id === '303548403520897025'; // TODO: parameterize this value
  }
}
