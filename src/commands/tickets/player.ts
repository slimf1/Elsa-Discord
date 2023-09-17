import Command from '../../command';
import Context from '../../context';
import {extractUserID} from '../../utils/discord';
import {GuildMember} from 'discord.js';
import {toLowerAlphaNum} from '../../utils/text';

class AddPlayerToTeam extends Command {
    async execute({message, bot, args}: Context): Promise<void> {
        let playerTag: string;
        let teamName: string;
        try {
            [playerTag, teamName] = args.split(',');
        } catch (error) {
            await message.reply('Usage: -add-player (player), (team)');
            return;
        }

        if (!playerTag || !teamName) {
            await message.reply('Usage: -add-player (player), (team)');
            return;
        }

        teamName = teamName.trim();
        const playerID = extractUserID(playerTag);
        if (!teamName || !playerID) {
            await message.reply('Usage: -add-player (player), (team)');
            return;
        }

        let player: GuildMember | null = null;
        try {
            player = await message.guild?.members.fetch(playerID) ?? null;
        } catch (error) {
            // osef
        }

        if (!player) {
            await message.reply('Could not find the player in the server.');
            return;
        }

        const teamID = toLowerAlphaNum(teamName);
        const team = await bot.repository.getTeam(teamID);
        if (!team) {
            await message.reply('Team doesn\'t exist.');
            return;
        }

        const tournamentDirector = await bot?.repository?.getTournamentDirector(message.author.id);
        const hasRightsToAdd = !!tournamentDirector
            || message.author.id === process.env.MAINTAINER
            || message.author.id === team.captainID;
        if (!hasRightsToAdd) {
            await message.reply('Only a tournament director, a maintainer or the captain can add a player to a team');
            return;
        }

        try {
            await bot.repository.addPlayer(playerID, team);
            await message.reply(`Added player <@${playerID}> to team ${team.name}`);
        } catch (error) {
            console.error('Error while adding player: ' + error);
            await message.reply(`An error occured : ${error}`);
        }
    }

    name(): string {
        return 'add-player';
    }

    isTournamentDirectorOnly(): boolean {
        return true;
    }
}

export default {
    commands: [AddPlayerToTeam]
};
