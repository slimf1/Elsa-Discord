import { Message } from 'discord.js';
import { IBot } from '../../bot';
import Command from '../../command';

export default class Info extends Command {
  async execute(bot: IBot, message: Message<boolean>): Promise<void> {
    const botTag = bot.client.user?.tag;
    const maintainerTag = bot.client.users.cache.get('303548403520897025')?.tag;
    await message
      .reply(`@${botTag}: Bot inutile développé et maintenu par @${maintainerTag}.`);
  }
  name(): string {
    return 'info';
  }
}
