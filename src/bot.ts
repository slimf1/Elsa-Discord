import { Client, Message } from 'discord.js';
import Command from './command';
import Context from './context';
import './database';
import Listener from './listener';

export type CommandCollection = Map<string, Command>;

export interface IBot {
  client: Client;
  commands: CommandCollection;
  addListeners(listener: Listener[]): void;
  removeAllListeners(): void;
}

export class Bot implements IBot {

  readonly client: Client;
  private readonly trigger: string;
  commands: CommandCollection;

  constructor(client: Client, commands: CommandCollection, trigger: string) {
    this.client = client;
    this.commands = commands;
    this.trigger = trigger;
  }

  addListener(event: string, listener: Listener) {
    this.client.on(event, listener.onEvent.bind(listener));
  }

  addListeners(listeners: Listener[]) {
    for (const listener of listeners) {
      this.addListener(listener.event, listener);
    }
  }

  removeAllListeners() {
    this.client.removeAllListeners();
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

      if (args.length > 1000 && message.member?.id !== process.env.MAINTAINER) {
        return;
      }

      if (this.commands.has(command)) {
        const commandInstance = this.commands.get(command);
        if (commandInstance?.canExecute(message.member)) {
          await commandInstance.execute(new Context(this, message, args));
        }
      }
    }
  }
}
