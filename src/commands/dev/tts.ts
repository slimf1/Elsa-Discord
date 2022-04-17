import Command from '../../command';
import context from '../../context';

class TTS extends Command {
  async execute({ message, args }: context): Promise<void> {
    await message.channel.send({ content: args, tts: true });
  }

  name(): string {
    return 'tts';
  }

  override isMaintainerOnly(): boolean {
    return true;
  }
}

export default {
  commands: [TTS]
};
