import { Client, Intents, Message } from 'discord.js';
import loadCommands from './src/command-loader';
import dotenv from 'dotenv';
import { Bot } from './src/bot';

async function run() {
  dotenv.config();
  const commands = await loadCommands();
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
    ]
  });
  const bot = new Bot(client, commands, process.env.TRIGGER ?? '!');

  client.on('ready', () => bot.onReady());
  client.on('messageCreate', async (message: Message) => {
    await bot.onMessageCreate(message);
  });

  client.login(process.env.DISCORD_TOKEN);
}

run();
