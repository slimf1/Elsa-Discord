import Command from '../../command';
import Context from '../../context';
import {sleep} from '../../utils';

class RemoveRoles extends Command {
    async execute({message, args}: Context): Promise<void> {
        if (args.length === 0) {
            await message.reply('Please provide a name.');
            return;
        }
        const user = await message.guild?.members.fetch(args);
        if (!user) {
            await message.reply('Could not find the user');
            return;
        }
        const roles = await message.guild?.roles.fetch();
        let i = 0;
        for (const role of roles?.values() ?? []) {
            if (role.id in user.roles.cache) {
                await user.roles.remove(role);
            }
            if (i++ % 5 === 0) {
                await sleep(1000);
            }
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
