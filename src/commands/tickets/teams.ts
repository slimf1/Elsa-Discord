import Command from '../../command';
import Context from '../../context';
import {extractUserID} from '../../utils/discord';
import {toLowerAlphaNum} from '../../utils/text';
import {GuildMember} from 'discord.js';

class AddTournamentTeam extends Command {
    async execute({message, bot, args}: Context): Promise<void> {
        let teamName: string;
        let captainTag: string;
        try {
            [teamName, captainTag] = args.split(',');
        } catch (error) {
            await message.reply('Usage: -add-team (team name), (captain)');
            return;
        }

        if (!captainTag || !teamName) {
            await message.reply('Usage: -add-team (team name), (captain)');
            return;
        }

        teamName = teamName.trim();
        const captainID = extractUserID(captainTag);
        if (!teamName || !captainID) {
            await message.reply('Usage: -add-team (team name), (captain)');
            return;
        }

        let captain: GuildMember | null = null;
        try {
            captain = await message.guild?.members.fetch(captainID) ?? null;
        } catch (error) {
            // osef
        }

        if (!captain) {
            await message.reply('Could not find the captain in the server.');
            return;
        }

        const teamID = toLowerAlphaNum(teamName);
        const team = await bot.repository.getTeam(teamID);
        if (team) {
            await message.reply('Team already exist.');
            return;
        }

        try {
            await bot.repository.addTeam(teamID, teamName, captainID);
            await message.reply(`Added new team "${teamName}" with captain <@${captainID}>`);
        } catch (error) {
            console.error('Error while adding new team: ' + error);
            await message.reply(`An error occured : ${error}`);
        }
    }

    name(): string {
        return 'add-team';
    }

    isTournamentDirectorOnly(): boolean {
        return true;
    }
}

class DeleteTournamentTeam extends Command {
    async execute({message, bot, args}: Context): Promise<void> {
        const teamID = toLowerAlphaNum(args);
        if (!teamID) {
            await message.reply('Usage: -delete-team (team name)');
            return;
        }

        const team = await bot.repository.getTeam(teamID);
        if (!team) {
            await message.reply('Team doesn\'t exist.');
            return;
        }

        try {
            await bot.repository.deleteTeam(teamID);
            await message.reply(`Removed team: ${team.name}`);
        } catch (error) {
            console.error('Error while removing team: ' + error);
            await message.reply(`An error occured : ${error}`);
        }
    }

    name(): string {
        return 'remove-team';
    }

    aliases(): string[] {
        return ['delete-team'];
    }

    isTournamentDirectorOnly(): boolean {
        return true;
    }
}

class ListTeams extends Command {
    async execute({message, bot, args}: Context): Promise<void> {
        const teams = await bot.repository.getTeams();
        if (teams.length === 0) {
            await message.reply('No teams found.');
            return;
        }

        let output = '# Teams\n';
        for (const team of teams) {
            output += `${team.name} (Cap: <@${team.captainID}>)`;
            if (team.players) {
                output += team.players.map(player => `<@${player.id}>`);
            }
            output += '\n';
        }

        await message.channel.send({content: output, allowedMentions: {parse: []}});
    }

    name(): string {
        return 'list-teams';
    }

    aliases(): string[] {
        return ['team-list'];
    }
}

export default {
    commands: [AddTournamentTeam, DeleteTournamentTeam, ListTeams]
};
