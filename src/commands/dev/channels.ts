import Command from '../../command';
import Context from '../../context';

class AddAllowedChannel extends Command {
  async execute({args}: Context): Promise<void> {
    process.env.AUTHORIZED_CHANNELS += `;${args}`;
  }

  name(): string {
    return 'add-allowed-channel';
  }

  override isMaintainerOnly(): boolean {
    return true;
  }
}

export default {
  commands: [AddAllowedChannel]
};
