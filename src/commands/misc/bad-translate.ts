import Command from '../../command';
import Context from '../../context';
import googletrans from 'googletrans';

const LANGUAGES = [
    'en', 'fr', 'es', 'de', 'it', 'pt',
    'ru', 'tr', 'ar', 'ja', 'ko', 'zh-cn',
    'hi', 'nl', 'pl'
];

function getRandomLanguage(exclude?: string): string {
    const choices = LANGUAGES.filter(l => l !== exclude);
    return choices[Math.floor(Math.random() * choices.length)];
}

class TranslateChaos extends Command {
    async execute({ args, message }: Context): Promise<void> {
        if (!args || args.trim().length === 0) {
            await message.reply('Please provide a text to translate.');
            return;
        }

        let text = args;
        let currentLang = 'en';

        try {
            for (let i = 1; i <= 10; i++) {
                const nextLang = getRandomLanguage(currentLang);

                const result = await googletrans(text, {
                    from: currentLang,
                    to: nextLang
                });

                text = result.text;
                currentLang = nextLang;
            }

            await message.channel.send(
                `🌍 **Translated 10 times**\n\n${text}`
            );
        } catch (e) {
            await message.reply('Could not translate the text.');
        }
    }

    name(): string {
        return 'bad-translate';
    }

    aliases(): string[] {
        return ['translate10', 'chaos-translate', 'pot9', 'melting-pot9'];
    }
}

export default {
    commands: [TranslateChaos]
};
