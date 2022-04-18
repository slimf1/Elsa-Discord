import Command from '../../command';
import Context from '../../context';

class TTS extends Command {
  async execute({ message, args }: Context): Promise<void> {
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
