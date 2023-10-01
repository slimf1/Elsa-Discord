import {BaseGuildTextChannel, TextChannel, ThreadChannel} from 'discord.js';

export async function createPrivateThread(channel: TextChannel,
                                          allowedUsersIds: string[],
                                          threadName: string,
                                          threadReason = ''):
    Promise<ThreadChannel> {
    const thread = await channel.threads.create({
        name: threadName,
        autoArchiveDuration: 60,
        type: 'GUILD_PRIVATE_THREAD',
        reason: threadReason
    });

    for (const allowedUserId of allowedUsersIds) {
        await thread.members.add(allowedUserId);
    }

    return thread;
}
