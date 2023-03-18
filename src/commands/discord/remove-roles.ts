import Command from '../../command';
import Context from '../../context';

class RemoveRoles extends Command {
    async execute({message, args}: Context): Promise<void> {
        if (args.length === 0) {
            await message.reply('Please provide a name.');
            return;
        }
        const user = await message.guild?.members.fetch(message.content);
        if (!user) {
            await message.reply('Could not find the user');
            return;
        }
        for (const [roleId, _] of user.roles.cache) {
            await user.roles.remove(roleId);
        }
        await message.reply('Removed roles');
    }

    name(): string {
        return 'remove-roles';
    }

    isMaintainerOnly(): boolean {
        return true;
    }
}

export default {
    commands: [RemoveRoles]
};
