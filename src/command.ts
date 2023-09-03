import {GuildMember} from 'discord.js';
import Context from './context';
import {IBot} from './bot';

export default abstract class Command {

    abstract execute(context: Context): Promise<void>;

    abstract name(): string;

    description(): string {
        return '';
    }

    aliases(): string[] {
        return [];
    }

    async canExecute(member: GuildMember | null, bot: IBot | null = null): Promise<boolean> {
        const isMaintainer = member?.id === process.env.MAINTAINER;
        if (isMaintainer) {
            return true;
        }
        if (this.isMaintainerOnly()) {
            return false;
        }
        if (this.isTournamentDirectorOnly() && member?.id) {
            const tournamentDirector = await bot?.repository?.getTournamentDirector(member.id);
            return !!tournamentDirector;
        }

        const whitelistUserIds = process.env.WHITELIST?.split(';') ?? [];
        if (this.isWhiteListOnly() && !whitelistUserIds.includes(member?.id ?? '')) {
            return false;
        }

        return true;
    }

    isMaintainerOnly(): boolean {
        return false;
    }

    isWhiteListOnly(): boolean {
        return false;
    }

    isTournamentDirectorOnly(): boolean {
        return false;
    }
}
