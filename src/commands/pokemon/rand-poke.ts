import Command from '../../command';
import Context from '../../context';
import { Dex, Species } from '@pkmn/dex';
import { choice } from '../../utils/rand';
import { Canvas, loadImage } from 'canvas';
import { MessageAttachment, ReplyMessageOptions } from 'discord.js';
import { loadCanvasFromUri } from '../../utils/images';

class RandPoke extends Command {
  private static readonly IMAGE_WIDTH = 96;
  private static readonly IMAGE_HEIGHT = 96;

  private static async loadCanvas(pokemon: Species): Promise<Canvas> {
    const canvas = await loadCanvasFromUri(
      RandPoke.IMAGE_WIDTH, RandPoke.IMAGE_HEIGHT,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.num}.png`
    );
    return canvas;
  }

  async execute({ message }: Context): Promise<void> {
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
        Stats: ${stats.hp}/${stats.atk}/${stats.def}/${stats.spa}/${stats.spd}/${stats.spe}
      `,
    };
    if (attachment) {
      messageOptions.files = [attachment];
    }
    await message.reply(messageOptions);
  }

  name(): string {
    return 'randpoke';
  }
}

export default {
  commands: [RandPoke]
};
