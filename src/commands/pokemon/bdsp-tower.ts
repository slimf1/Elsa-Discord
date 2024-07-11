import Command from "../../command";
import Context from "../../context";
import { toLowerAlphaNum } from "../../utils/text";
import { bdspSets } from "./bdsp-sets";
import { bdspTrainers } from "./bdsp-trainers";

const Mapper: {[key: string]: number} = {
    'solo': 0,
    'expertsolo': 1,
    'duo': 2,
    'expertduo': 3
}

class BdspTower extends Command {

    async execute({message, args}: Context): Promise<void> {
        const spl = args.split(',');

        const trainerName = spl[0].trim();
        let category: string;
        if (spl.length >= 2) {
            category = toLowerAlphaNum(spl[1]);
        } else {
            category = 'expertsolo' 
        };

        try {
            const trainer = bdspTrainers[Mapper[category]][trainerName];
            let buffer = '';
            let i = 0;
            console.log({trainer, bdspTrainers, truc: Mapper[category], efdsf: bdspTrainers[Mapper[category]]});
            for (const team of trainer) {
                buffer += `Team ${i}: `;
                for (const setId of team) {
                    const set = bdspSets[setId];
                    buffer += `${set.pokemonName}, Talent: ${set.talent}, Item: ${set.item}, Moves: ${[set.move1, set.move2, set.move3, set.move4].filter(s => s).join('/')}, Nature: ${set.nature}, EVs: ${set.evs}\n`;
                }
                buffer += '\n\n';
                i++;
            }
            await message.reply(buffer);
        } catch (error) {
            console.log(error);
            await message.reply('Une erreur est survenue ^-^')
        }
    }

    name(): string {
        return 'bdsp-tower';
    }

    aliases(): string[] {
        return ['t'];
    }

}

export default {
    commands: [BdspTower]
};
