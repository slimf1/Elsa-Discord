import { GuildMember } from 'discord.js';
import Context from './context';

export default abstract class Command {
  abstract execute(context: Context): Promise<void>;
  abstract name(): string;
  description(): string {
    return '';
  }
  canExecute(member: GuildMember | null): boolean { // TODO: parameterize these values
    return (member?.roles.cache.has('964954859679924264')
         || member?.roles.cache.has('599240075410145301')) ?? false;
  }
}
