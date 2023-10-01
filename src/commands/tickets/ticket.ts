import Command from '../../command';
import Context from '../../context';
import {extractUserID} from '../../utils/discord';
import {createPrivateThread} from '../../utils/threads';
import {TextChannel} from 'discord.js';

class CreateTicket extends Command {
    async execute({message, bot, args}: Context): Promise<void> {
        const userID = extractUserID(args);
        if (userID === null) {
            await message.reply('Could not retrieve user.');
            return;
        }

        const channel = message.channel as TextChannel;
        if (!channel) {
            return;
        }

        const opponentTeam = await bot.repository.getTeamFromPlayerID(userID);
        const playerTeam = await bot.repository.getTeamFromPlayerID(message.author.id);
        const tournamentDirectors = await bot.repository.getTournamentDirectors();

        const userIdsToInvite = [userID, message.author.id, opponentTeam?.captainID, playerTeam?.captainID,
            ...tournamentDirectors.map(t => t.id)].filter(item => !!item) as string[];

        const ticketName = `Ticket ${playerTeam?.name} vs. ${opponentTeam?.name}`;
        const thread = await createPrivateThread(channel, userIdsToInvite, ticketName);

        await thread.send(`Un nouveau ticket a été créé par <@${message.author.id}> à propos de <@${userID}>`);
        await thread.send('Les directeurs des tournois et les capitaines de chaque équipe ont été invités.');
        console.log('DEBUG: joueurs invités: '+ userIdsToInvite.map(t => `<@${t}>`).join(', '));
    }

    name(): string {
        return 'ticket';
    }
}

export default {
    commands: [CreateTicket]
};
