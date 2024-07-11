import Command from '../../command';
import Context from '../../context';
import {choice} from '../../utils/rand';
import {Dex} from '@pkmn/dex';

class Kunc extends Command {
    async execute(context: Context): Promise<void> {
        const pokemon = choice(Dex.species.all());
        const learnSet = await Dex.learnsets.get(pokemon.id);
        //const moves = choice(Object.keys(learnSet.learnset));
        //if (learnSet.learnset)
    }

    name(): string {
        return 'kunc';
    }
}

export default {
    commands: [Kunc]
};

