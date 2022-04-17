import { Message } from 'discord.js';
import { IBot } from './bot';

export default class Context {
  readonly bot: IBot;
  readonly message: Message;
  readonly args: string;

  constructor(bot: IBot, message: Message, args: string) {
    this.bot = bot;
    this.message = message;
    this.args = args;
  }
}
