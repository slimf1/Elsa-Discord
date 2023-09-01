import Command from '../../command';
import Context from '../../context';

class TestPM extends Command {
    async execute({message, args, bot}: Context): Promise<void> {
        let userID: string;
        let privateMessageContent: string;
        try {
            [userID, privateMessageContent] = args.split(',');
        } catch (error) {
            await message.reply('Usage : -test-pm {userID}, {message}');
            return;
        }

        const user = await bot.client.users.fetch(userID);
        await user.send(`Private message from ${message.author.username} : ${privateMessageContent}`);
    }

    name(): string {
        return 'test-pm';
    }

    override isMaintainerOnly(): boolean {
        return true;
    }
}

export default {
    commands: [TestPM]
};
