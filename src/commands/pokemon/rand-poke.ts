import Command from '../../command';
import context from '../../context';
import { Dex, Species } from '@pkmn/dex';
import { choice } from '../../utils/rand';
import { Canvas, loadImage } from 'canvas';
import { MessageAttachment, ReplyMessageOptions } from 'discord.js';

class RandPoke extends Command {

  static async loadCanvas(pokemon: Species): Promise<Canvas> {
    const canvas = new Canvas(96, 96);
    const context = canvas.getContext('2d');
    const image = await loadImage(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.num}.png`
    );
    context.drawImage(image, 0, 0, 96, 96);
    return canvas;
  }

  async execute({ message }: context): Promise<void> {
    const pokemon = choice(Dex.species.all());
    let attachment: MessageAttachment | null = null;
    try {
      const canvas = await RandPoke.loadCanvas(pokemon);
      attachment = new MessageAttachment(canvas.toBuffer(), 'image.png');
    } catch (e) {
      console.error(e);
    }

    const stats = pokemon.baseStats;
    const messageOptions: ReplyMessageOptions = {
      content: `**${pokemon.name}** (n°${pokemon.num})
        Type: ${pokemon.types.join('/')}
        Talents: ${Object.values(pokemon.abilities).join('/')}
        Poids: ${pokemon.weightkg} kg
        Stats: ${stats.atk}/${stats.def}/${stats.hp}/${stats.spa}/${stats.spd}/${stats.spe}
      `,
      files: []
    };
    if (attachment) {
      messageOptions.files = [attachment];
    }
    message.reply(messageOptions);
  }

  name(): string {
    return 'randpoke';
  }
}

export default {
  commands: [RandPoke]
};
