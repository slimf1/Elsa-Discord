import Command from '../../command';
import Context from '../../context';
import { bash } from '../../utils';

class Update extends Command {
  async execute({ message }: Context): Promise<void> {
    try {
      const { stdout, stderr } = await bash('git pull origin master');
      await message.channel.send('Pull successful :');
      await message.channel.send(`
          \`\`\`
          ${stdout}
          ${stderr}
          \`\`\`
        `);
    } catch (error) {
      await message.channel.send('Failed to pull :');
      await message.channel.send(`
          \`\`\`
          ${error}
          \`\`\`
        `);
    }
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
