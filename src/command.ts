import { GuildMember } from 'discord.js';
import Context from './context';

export default abstract class Command {
  abstract execute(context: Context): Promise<void>;
  abstract name(): string;
  description(): string {
    return '';
  }
  canExecute(member: GuildMember | null): boolean {
    if (this.isMaintainerOnly()) {
      return member !== null && member.id === process.env.MAINTAINER;
    }
    const authorizedRoles = process.env.AUTHORIZED_ROLES?.split(';');
    return !!authorizedRoles
      && !!member
      && authorizedRoles.some(role => member.roles.cache.has(role));
  }
  isMaintainerOnly(): boolean {
    return false;
  }
}
