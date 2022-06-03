import Command from '../../command';
import Context from '../../context';
import {hashColor} from '../../utils/showdown';
import {toLowerAlphaNum} from '../../utils/text';

class CreateRole extends Command {
    async execute({message, args}: Context): Promise<void> {
        if (args.length === 0) {
            await message.reply('Please provide a name.');
            return;
        }
        const roleColor = hashColor(toLowerAlphaNum(args));
        const role = await message.guild?.roles.create({
            color: roleColor,
            name: args,
            reason: 'Created by Elsa-Mina',
            mentionable: true
        });
        if (!role) {
            await message.reply('Could not create the role');
            return;
        }
        await message.reply(`Created role: <@&${role.id}>`);
    }

    name(): string {
        return 'create-role';
    }
}

export default {
    commands: [CreateRole]
};
