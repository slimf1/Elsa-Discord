import { Client, Message } from 'discord.js';
import Command from './command';

// TODO: git based auto update on remote

export interface IBot {
  client: Client;
  commands: Map<string, Command>;
}

export class Bot implements IBot {

  readonly client: Client;
  private readonly trigger: string;
  commands: Map<string, Command>;

  constructor(client: Client, commands: Map<string, Command>, trigger: string) {
    this.client = client;
    this.commands = commands;
    this.trigger = trigger;
  }

  onReady() {
    console.log(`Logged in as ${this.client.user?.tag}!`);
  }

  async onMessageCreate(message: Message) {
    if (message.content.startsWith(this.trigger)) {
      const command = message
        .content
        .substring(this.trigger.length)
        .split(' ')[0];
      const args = message
        .content
        .substring(this.trigger.length + command.length + 1);

      if (this.commands.has(command)) {
        const commandInstance = this.commands.get(command);
        if (commandInstance?.canExecute(message.member)) {
          await commandInstance.execute(this, message, args);
        }
      }
    }
  }
}
