import {Collection, GuildChannelCreateOptions, GuildMember, TextChannel} from 'discord.js';
import Command from '../../command';
import Context from '../../context';
import {fetchAllMessages} from '../../utils/discord';
import {sleep} from '../../utils';

const channelsNeedingConfirmationForRegularClean: Set<string> = new Set();
const channelsNeedingConfirmationForTurboClean: Set<string> = new Set();

class CleanChannel extends Command {
    private static readonly MESSAGES_PER_DELETE = 100;
    private static readonly CONFIRMATION_TIMEOUT = 15000;

    private static readonly USER_REGEX = /<@(\d+)>/;
    private static readonly CHANNEL_REGEX = /<#(\d+)>/;

    async execute({bot, message, args}: Context): Promise<void> {
        console.log({ message, args });
        const argsArray = args.split(',');
        if (argsArray.length < 1) {
            await message.channel.send('Please specify a channel to clean.');
            return;
        }
        if (bot.isCleaning) {
            await message.channel.send('A clean is currently ongoing.');
            return;
        }
        const channelMatch = argsArray[0].match(CleanChannel.CHANNEL_REGEX);
        const channelID = channelMatch ? channelMatch[1] : null;
        let user: GuildMember | null = null;
        if (argsArray.length >= 2) {
            const userMatch = argsArray[1].match(CleanChannel.USER_REGEX);
            const userID = userMatch ? userMatch[1] : null;
            user = userID ? (await message.guild?.members.fetch(userID) ?? null) : null;
        }

        if (channelID == null) {
            await message.channel.send('Could not find this channel.');
            return;
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
        bot.isCleaning = true;
        let messages = await fetchAllMessages(channel);
        messages = messages.filter((m => !m.pinned));
        if (user) {
            messages = messages.filter(m => m.author.id === user?.id);
        }
        let i = 1;
        const n = messages.length;
        await channel.send(`Will delete ${n} messages.`);
        const mainMsg = await channel.send('Starting....');
        const mainMsgID = mainMsg.id;

        for (const message of messages) {
            await message.delete();
            if (++i % 10 === 0) {
                const ratio = i / n;
                try {
                    const mainMsgFetch = await message.channel.messages.fetch(mainMsgID);
                    if (mainMsgFetch) {
                        mainMsg.edit(`Deleted ${i}/${n} messages... [${(ratio * 100).toFixed(1)}%]`);
                    }
                } catch (err) {
                    console.error(`Could not edit the message : ${err}`);
                }
                await sleep(1250);
            }
            await sleep(75);
        }
        bot.isCleaning = false;
        await channel.send(`Done : Deleted ${i - 1} messages.`);
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
