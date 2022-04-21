import { Client, Intents } from 'discord.js';
import { loadPlugins } from './src/command-loader';
import dotenv from 'dotenv';
import { Bot } from './src/bot';
import './src/database';

dotenv.config();

async function run() {
  const [commands, listeners] = await loadPlugins();
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.DIRECT_MESSAGES,
    ]
  });
  const bot = new Bot(client, commands, process.env.TRIGGER ?? '!');
  bot.addListeners(listeners);

  client.on('ready', bot.onReady.bind(bot));
  client.on('messageCreate', bot.onMessageCreate.bind(bot));

  client.login(process.env.DISCORD_TOKEN);
}

run();
