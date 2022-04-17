import { Message } from 'discord.js';
import { IBot } from '../bot';
import Command from '../command';

export default class Ping extends Command {

  async execute(bot: IBot, message: Message): Promise<void> {
    await message.reply('pong!');
  }

  name(): string {
    return 'ping';
  }

  override description(): string {
    return 'Returns pong.';
  }
}
