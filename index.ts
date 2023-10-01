import {Client, Intents} from 'discord.js';
import {loadPlugins} from './src/command-loader';
import dotenv from 'dotenv';
import {Bot} from './src/bot';
import {BotRepository} from './src/database';

dotenv.config();

async function run() {
    const [commands, listeners] = await loadPlugins();
    const repository = new BotRepository();
    const client = new Client({
        partials: [
            'CHANNEL'
        ],
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.DIRECT_MESSAGES
        ]
    });
    const bot = new Bot(client, commands, process.env.TRIGGER ?? '!', repository);
    bot.addListeners(listeners);

    client.on('ready', bot.onReady.bind(bot));
    client.on('messageCreate', bot.onMessageCreate.bind(bot));

    await client.login(process.env.DISCORD_TOKEN);
}

run();
