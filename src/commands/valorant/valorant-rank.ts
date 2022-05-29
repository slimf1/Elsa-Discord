import {MessageAttachment} from 'discord.js';
import Command from '../../command';
import Context from '../../context';
import {loadCanvasFromUri} from '../../utils/images';
import {getValorantMMRData, getValorantUserData, UserDataResponse} from './calls';

class ValorantRank extends Command {
    async execute({message, args}: Context): Promise<void> {
        let userDataResponse: UserDataResponse | undefined = undefined;
        try {
            userDataResponse = await getValorantUserData(args);
        } catch (error) {
            await message.reply('Could not find this player.');
            return;
        }
        if (userDataResponse.status !== 200) {
            await message.reply('Could not find this player: ' + userDataResponse.message);
            return;
        }
        const userData = userDataResponse.data!;
        let response = `**${userData.name}#${userData.tag}**\n` +
            `*Level*: ${userData.account_level}\n` +
            `*Region*: ${userData.region}\n`;

        const mmrDataResponse = await getValorantMMRData(userData.name, userData.tag, userData.region);
        if (mmrDataResponse.status === 200) {
            const mmrData = mmrDataResponse.data!;
            response += `*Tier*: ${mmrData.currenttierpatched}, ${mmrData.ranking_in_tier} pts\n`;
        }

        const canvas = await loadCanvasFromUri(128, 128, userData.card.small);
        await message.channel.send({files: [new MessageAttachment(canvas.toBuffer(), 'avatar.png')]});
        await message.channel.send(response);
    }

    name(): string {
        return 'valorant-rank';
    }

    description(): string {
        return 'Get the Valorant rank of a player.';
    }
}

export default {
    commands: [ValorantRank]
};
