import Command from '../../command';
import context from '../../context';
import { Dex } from '@pkmn/dex';
import { choice } from '../../utils/rand';

class RandPoke extends Command {
  async execute({ message }: context): Promise<void> {
    const randomPokemon = choice(Dex.species.all());
    await message.channel.send(`${randomPokemon.name} (${randomPokemon.id})`);
  }
  name(): string {
    return 'randpoke';
  }
}

export default {
  commands: [RandPoke]
};
