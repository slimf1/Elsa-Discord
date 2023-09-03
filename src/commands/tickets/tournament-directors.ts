import Command from '../../command';
import Context from '../../context';
import {extractUserID} from '../../utils/discord';

class AddTournamentDirector extends Command {
    async execute({message, bot, args}: Context): Promise<void> {
        const userID = extractUserID(args);
        if (!userID) {
            await message.reply('Usage: -add-tournament-director (user)');
            return;
        }

        const user = await message.guild?.members.fetch(userID);
        if (!user) {
            await message.reply('Could not find this user in the server.');
            return;
        }

        const tournamentDirector = await bot.repository.getTournamentDirector(args);
        if (tournamentDirector) {
            await message.reply('Tournament director already exists.');
            return;
        }

        try {
            await bot.repository.addTournamentDirector(userID);
            await message.reply(`Added new tournament director : <@${userID}>`);
        } catch (error) {
            console.error('Error while adding tournament director: '+ error);
            await message.reply(`An error occured : ${error}`);
        }
    }

    name(): string {
        return 'add-tournament-director';
    }

    override isMaintainerOnly(): boolean {
        return true;
    }
}

class RemoveTournamentDirector extends Command {
    async execute({message, bot, args}: Context): Promise<void> {
        const userID = extractUserID(args);
        if (!userID) {
            await message.reply('Usage: -remove-tournament-director (user)');
            return;
        }

        const tournamentDirector = await bot.repository.getTournamentDirector(userID);
        if (!tournamentDirector) {
            await message.reply('Could not find this tournament director.');
            return;
        }

        try {
            await bot.repository.deleteTournamentDirector(userID);
            await message.reply(`Removed tournament director : <@${userID}>`);
        } catch (error) {
            console.error('Error while removing tournament director: '+ error);
            await message.reply(`An error occured : ${error}`);
        }
    }

    name(): string {
        return 'remove-tournament-director';
    }

    override isMaintainerOnly(): boolean {
        return true;
    }
}

class ListTournamentDirector extends Command {
    async execute({message, bot}: Context): Promise<void> {
        const tournamentDirectors = await bot.repository.getTournamentDirectors();
        if (tournamentDirectors.length === 0) {
            await message.reply('No tournament directors found');
            return;
        }

        await message.reply(`Tournament directors: ${tournamentDirectors.map(td => `<@${td.id}>`).join(', ')}`);
    }

    name(): string {
        return 'tournament-directors';
    }
}

export default {
    commands: [AddTournamentDirector, RemoveTournamentDirector, ListTournamentDirector]
};
