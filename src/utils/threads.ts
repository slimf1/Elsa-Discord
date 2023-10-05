import {TextChannel, ThreadChannel} from 'discord.js';

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
        try {
            await thread.members.add(allowedUserId);
        } catch (error) {
            console.error(`Could not add member with id ${allowedUserId} to thread ${threadName}`);
            console.error(error);
        }
    }

    return thread;
}
