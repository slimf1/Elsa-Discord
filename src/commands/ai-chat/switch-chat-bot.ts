import Command from "../../command";
import Context from "../../context";

class SwitchChatBotCommand extends Command {
    async execute({bot, message, args}: Context): Promise<void> {
        const id = args.trim();
        
        if (!id) {
            await message.channel.send('Usage: !switch-chat-bot <id>. e.g. !switch-chat-bot assistant.');
            return;
        }

        const personality = await bot.repository.getChatBotPersonality(id);
        
        if (!personality) {
            await message.channel.send('No chat bot personality found with this ID.');
            return;
        }
        
        bot.currentChatBots.set(message.guildId!, personality.id);
        await message.channel.send(`Switched to chat bot personality with ID: ${personality.id}`);
    }

    name(): string {
        return 'switch-chat-bot';
    }

    aliases(): string[] {
        return ['switch-chatbot', 'set-chat-bot'];
    }
}

export default {
    commands: [SwitchChatBotCommand]
}
