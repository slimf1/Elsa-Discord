import { Duration } from 'luxon';
import Command from '../../command';
import Context from '../../context';
import Listener from '../../listener';
import { Message } from 'discord.js';
import { sleep } from '../../utils';

class SnapChat extends Command {

    private static readonly SNAPCHAT_MODE_MS_DURATION = 1 * 60 * 1000;
    private static readonly SNAPCHAT_MODE_MIN_DURATION = Duration
        .fromMillis(SnapChat.SNAPCHAT_MODE_MS_DURATION).as('minutes');

    async execute({message, bot}: Context): Promise<void> {
        if (bot.snapChatsChannels.has(message.channel?.id ?? '')) {
            await message.reply('This channel is currently in snapchat mode');
        }
        await message.reply('From now on, this channel is in snapchat mode.');
        await message.reply(
            'This means that any message posted after this one ' +
            `will be deleted after ${SnapChat.SNAPCHAT_MODE_MIN_DURATION} minute(s).`);
        bot.snapChatsChannels.set(message.channelId, []);

        setTimeout(async () => {
            await message.channel.send('Snapchat mode has ended. Deleting messages...');
            const messagesToBeDeleted = bot.snapChatsChannels.get(message.channelId)?.slice();
            bot.snapChatsChannels.delete(message.channelId);
            let i = 1;
            for (const messageToBeDeleted of messagesToBeDeleted ?? []) {
                await messageToBeDeleted.delete();
                await sleep(75);
                if (++i % 5 == 0) {
                    await sleep(500);
                }
            }
        }, SnapChat.SNAPCHAT_MODE_MS_DURATION);
    }

    override isWhiteListOnly(): boolean {
        return true;
    }

    name(): string {
        return 'snapchat';
    }
}

class SnapChatEnd extends Command {

    async execute({message, bot}: Context): Promise<void> {
        if (!bot.snapChatsChannels.has(message.channelId)) {
            await message.reply('This channed isn\'t currently in snapchat mode.');
            return;
        }
        bot.snapChatsChannels.delete(message.channelId);
        await message.reply('Snapchat mode ended early.');
    }

    override isWhiteListOnly(): boolean {
        return true;
    }

    name(): string {
        return 'snapchat-end';
    }
}

class SnapChatListener extends Listener {
    constructor() {
        super('messageCreate');
    }

    async onEvent(...args: unknown[]): Promise<void> {
        const [message] = args as [Message];
        if (!this.bot?.snapChatsChannels.has(message.channelId)) {
            return;
        }
        this.bot?.snapChatsChannels.get(message.channelId)?.push(message);
    }
}

export default {
    commands: [SnapChat, SnapChatEnd],
    listeners: [SnapChatListener],
};
