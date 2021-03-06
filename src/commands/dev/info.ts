import Command from '../../command';
import Context from '../../context';

class Info extends Command {
    async execute({bot, message}: Context): Promise<void> {
        const botName = bot.client.user?.username;
        const maintainerName = bot.client.users.cache.get(process.env.MAINTAINER ?? '')?.username;
        await message.reply(
            `**${botName}**: Bot inutile développé et maintenu par **${maintainerName}**.
            Dépôt: https://github.com/slimf1/Elsa-Discord`
        );
    }

    name(): string {
        return 'info';
    }
}

export default {
    commands: [Info]
};
