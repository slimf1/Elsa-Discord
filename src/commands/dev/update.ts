import { exec } from 'child_process';
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
  override isMaintainerOnly(): boolean {
    return true;
  }
}

export default {
  commands: [Update]
};
