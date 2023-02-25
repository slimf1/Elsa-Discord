import {Collection, GuildChannelCreateOptions, GuildMember, TextChannel} from 'discord.js';
import Command from '../../command';
import Context from '../../context';

const channelsNeedingConfirmationForRegularClean: Set<string> = new Set();
const channelsNeedingConfirmationForTurboClean: Set<string> = new Set();

class CleanChannel extends Command {
    private static readonly MESSAGES_PER_DELETE = 100;
    private static readonly CONFIRMATION_TIMEOUT = 15000;

    async execute({bot, message, args}: Context): Promise<void> {
        const argsArray = args.split(',');
        if (argsArray.length < 1) {
            await message.channel.send('Please specify a channel to clean.');
            return;
        }
        const channelID = argsArray[0];
        let user: GuildMember | null = null;
        if (argsArray.length >= 2) {
            const userID = argsArray[1].trim();
            user = userID ? (await message.guild?.members.fetch(userID) ?? null) : null;
        }

        const channel = bot.client.channels.cache.get(channelID) as TextChannel;
        if (!channel || !(channel instanceof TextChannel)) {
            await message.reply('Please specify a valid channel.');
            return;
        }
        if (!channelsNeedingConfirmationForRegularClean.has(channel.id)) {
            await message.reply(`Are you sure you want to clean all messages ${
                    user ? `from user "${user.displayName}"`: ''} in ${channel.name}? ` +
                'If so, redo the command.');
            channelsNeedingConfirmationForRegularClean.add(channel.id);
            setTimeout(() => {
                channelsNeedingConfirmationForRegularClean.delete(channel.id);
            }, CleanChannel.CONFIRMATION_TIMEOUT);
            return;
        }
        channelsNeedingConfirmationForRegularClean.delete(channel.id);
        let messages = await channel.messages.fetch({limit: CleanChannel.MESSAGES_PER_DELETE});
        messages = new Collection([...messages.entries()].filter(([s, m]) => !m.pinned));
        if (user) {
            messages = new Collection([...messages.entries()]
                .filter(([s, m]) => m.author.id === user?.id));
        }
        await channel.bulkDelete(messages, true);
        await message.channel.send(`Deleted ${messages.size} messages.`);
    }

    name(): string {
        return 'clean-channel';
    }

    override isWhiteListOnly(): boolean {
        return true;
    }

    override description(): string {
        return `Deletes at most ${CleanChannel.MESSAGES_PER_DELETE} messages in a channel.`
            + ' Syntax: clean-channel <channel ID>, <user ID (optional)>';
    }
}

class TurboClean extends Command {

    private static readonly CONFIRMATION_TIMEOUT = 15000;

    async execute({bot, args, message}: Context): Promise<void> {
        const channel = bot.client.channels.cache.get(args) as TextChannel;
        if (!channel || !(channel instanceof TextChannel)) {
            await message.reply('Please specify a valid channel.');
            return;
        }
        if (!channelsNeedingConfirmationForTurboClean.has(channel.id)) {
            await message.reply(`Are you sure you want to clean all messages in ${channel.name}? ` +
                'This will delete the channel then recreate it. If so, redo the command.');
            channelsNeedingConfirmationForTurboClean.add(channel.id);
            setTimeout(() => {
                channelsNeedingConfirmationForTurboClean.delete(channel.id);
            }, TurboClean.CONFIRMATION_TIMEOUT);
            return;
        }
        channelsNeedingConfirmationForTurboClean.delete(channel.id);
        const channelName = channel.name;
        const channelParent = channel.parent;
        const channelPosition = channel.position;
        const isChannelNsfw = channel.nsfw;
        const channelTopic = channel.topic;
        await channel.delete();
        const options: GuildChannelCreateOptions = {
            type: 'GUILD_TEXT',
            parent: channelParent!,
            position: channelPosition + 1,
            nsfw: isChannelNsfw,
            topic: channelTopic ?? undefined
        };
        message.guild?.channels.create(channelName, options);
    }

    name(): string {
        return 'turbo-clean';
    }

    isMaintainerOnly(): boolean {
        return true;
    }
}

export default {
    commands: [CleanChannel, TurboClean]
};
