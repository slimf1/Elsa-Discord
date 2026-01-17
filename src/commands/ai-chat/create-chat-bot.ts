import Command from "../../command";
import Context from "../../context";

class CreateChatBotCommand extends Command {
    async execute({bot, message, args}: Context): Promise<void> {
        const [id, provider, ...systemPromptParts] = args.split(',');
        const systemPrompt = systemPromptParts.join(',').trim();

        if (!id || !provider || !systemPrompt) {
            await message.channel.send('Usage: !create-chat-bot <id>, <provider>, <system prompt>. e.g. !create-chat-bot assistant, openai, You are a helpful assistant.');
            return;
        }

        const existingPersonality = await bot.repository.getChatBotPersonality(id);

        if (existingPersonality) {
            await message.channel.send('A chat bot personality already exists with this ID.');
            return;
        }
        
        const personality = await bot.repository.createChatBotPersonality(
            id,
            provider,
            systemPrompt
        );

        if (!personality) {
            await message.channel.send('Failed to create chat bot personality.');
            return;
        }

        await message.channel.send(`Chat bot personality created with ID: ${personality.id}`);
    }
    
    name(): string {
        return 'create-chat-bot';
    }
    
    aliases(): string[] {
        return ['create-chatbot', 'add-chat-bot'];
    }
}

export default {
    commands: [CreateChatBotCommand]
}