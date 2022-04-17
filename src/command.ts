import { GuildMember, Message } from 'discord.js';
import { IBot } from './bot';

export default abstract class Command {
  abstract execute(bot: IBot, message: Message, args: string): Promise<void>;
  abstract name(): string;
  description(): string {
    return '';
  }
  canExecute(member: GuildMember | null): boolean { // TODO: parameterize these values
    return (member?.roles.cache.has('964954859679924264')
         || member?.roles.cache.has('599240075410145301')) ?? false;
  }
}
