import Command from '../../../command';
import Context from '../../../context';
import {fetchUserData, User} from './user';
import {toLowerAlphaNum} from '../../../utils/text';

class ShowdownLadder extends Command {

    private static readonly MAX_FORMAT_PADDING = 20;

    async execute({message, args}: Context): Promise<void> {

        let userData: User | undefined;

        try {
            userData = await fetchUserData(toLowerAlphaNum(args));
        } catch (error) {
            await message.reply('Could not find this player.');
            return;
        }

        const ratings = Object
            .entries(userData.ratings)
            .sort(([, rating1], [, rating2]) => Number(rating2.gxe) - Number(rating1.gxe));
        let i = 0;
        let response = 'Format'.padEnd(ShowdownLadder.MAX_FORMAT_PADDING, ' ') + ' \t ELO  \t GXE\n';

        for (const [format, rating] of ratings) {
            const paddedFormat = format.padEnd(ShowdownLadder.MAX_FORMAT_PADDING, ' ');
            const elo = Number(rating.elo).toFixed(0);
            const gxe = Number(rating.gxe).toFixed(1);
            response += `${paddedFormat} \t ${elo} \t ${gxe}`;
            if (i++ < 5) {
                response += '\n';
            } else {
                break;
            }
        }

        await message.reply('```'+ response + '```');
    }

    name(): string {
        return 'ladder';
    }
}

export default {
    commands: [ShowdownLadder]
};
