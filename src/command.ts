import {GuildMember} from 'discord.js';
import Context from './context';

export default abstract class Command {

    abstract execute(context: Context): Promise<void>;

    abstract name(): string;

    description(): string {
        return '';
    }

    aliases(): string[] {
        return [];
    }

    canExecute(member: GuildMember | null): boolean {
        const isMaintainer = member?.id === process.env.MAINTAINER;
        if (isMaintainer) {
            return true;
        }
        if (this.isMaintainerOnly()) {
            return false;
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
}
