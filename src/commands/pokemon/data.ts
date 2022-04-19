import Command from '../../command';
import Context from '../../context';
import { Dex, ID } from '@pkmn/dex';

class Data extends Command {
  async execute({ message, args }: Context): Promise<void> {
    const pokemon = Dex.species.getByID(args as ID);
    if (!pokemon.abilities['0']) {
      await message.channel.send('Pokemon not found');
      return;
    }
    const reply = `
      **${pokemon.name}**
      ${pokemon.types.map(type => `**${type}**`).join('/')}
      Abilities: ${pokemon.abilities['0']} / ${pokemon.abilities['1']} / ${pokemon.abilities['H']}
      ${pokemon.baseStats.hp} HP
      ${pokemon.baseStats.atk} Atk
      ${pokemon.baseStats.def} Def
      ${pokemon.baseStats.spa} SpA
      ${pokemon.baseStats.spd} SpD
      ${pokemon.baseStats.spe} Spe
      Base Forme: ${pokemon.baseForme}
      Base Species: ${pokemon.baseSpecies} (evolves at ${pokemon.evoLevel})
    `;
    await message.channel.send(reply);
  }
  name(): string {
    return 'data';
  }

}

export default {
  commands: [Data]
};
