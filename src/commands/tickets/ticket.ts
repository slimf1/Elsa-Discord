import Command from '../../command';
import Context from '../../context';
import {createPrivateThread} from '../../utils/threads';
import {TextChannel} from 'discord.js';
import {toLowerAlphaNum} from '../../utils/text';

class CreateTicket extends Command {
    async execute({message, bot, args}: Context): Promise<void> {
        const guild = await message.client.guilds.fetch('489748586561536001');
        const channel = await guild?.channels.fetch('495494277934088193');
        if (!channel) {
            console.debug('Could not get channel for new ticket');
            return;
        }

        const targetMemberUsername = toLowerAlphaNum(args);
        const targetMember = (await guild.members.fetch())
            .find(member => toLowerAlphaNum(member.user.username) === targetMemberUsername);

        if (!targetMember) {
            await message.reply('Impossible de trouver l\'utilisateur.');
            return;
        }
        const userID = targetMember.id;

        const opponentTeam = await bot.repository.getTeamFromPlayerID(targetMember.id);
        const playerTeam = await bot.repository.getTeamFromPlayerID(message.author.id);


        if ((!opponentTeam || !playerTeam) || (opponentTeam?.id === playerTeam?.id)) {
            return;
        }

        const tournamentDirectors = await bot.repository.getTournamentDirectors();

        const userIdsToInvite = [userID, message.author.id, opponentTeam?.captainID, playerTeam?.captainID,
            ...tournamentDirectors.map(t => t.id)].filter(item => !!item) as string[];

        const ticketName = `Ticket ${playerTeam?.name} vs. ${opponentTeam?.name}`;
        const thread = await createPrivateThread(channel as TextChannel, userIdsToInvite, ticketName);

        await thread.send(`Un nouveau ticket a été créé par <@${message.author.id}> à propos de <@${userID}>`);
        await thread.send('Les directeurs des tournois et les capitaines de chaque équipe ont été invités.');
        console.log('DEBUG: joueurs invités: '+ userIdsToInvite.join(', '));
    }

    name(): string {
        return 'ticket';
    }
}

export default {
    commands: [CreateTicket]
};
