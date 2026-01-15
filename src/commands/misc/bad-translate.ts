import Command from '../../command';
import Context from '../../context';
import googletrans from 'googletrans';

const LANGUAGES = [
  'af', 'sq', 'am', 'ar', 'hy', 'as', 'ay', 'az', 'bm', 'eu', 'be', 'bn', 'bs', 'bg', 'ca',
  'ny', 'co', 'hr', 'cs', 'da', 'dv', 'nl', 'en', 'eo', 'et', 'tl', 'ee', 'fi', 'fr', 'fy',
  'gl', 'ka', 'de', 'el', 'gn', 'gu', 'ht', 'ha', 'he', 'iw', 'hi', 'hm', 'hu', 'is', 'ig',
  'id', 'ga', 'it', 'ja', 'jw', 'kn', 'kk', 'km', 'rw', 'ko', 'ku', 'ky', 'lo', 'la', 'lv',
  'ln', 'lt', 'lg', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mn', 'my', 'ne', 'no',
  'om', 'ps', 'fa', 'pl', 'pt', 'pa', 'qu', 'ro', 'ru', 'sm', 'sa', 'sr', 'st', 'sn', 'sd',
  'si', 'sk', 'sl', 'so', 'es', 'su', 'sw', 'sv', 'tg', 'ta', 'tt', 'te', 'th', 'ti', 'ts',
  'tr', 'tk', 'ak', 'uk', 'ur', 'ug', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu', 'zh'
]

function getRandomLanguage(exclude?: string): string {
    const choices = LANGUAGES.filter(l => l !== exclude);
    return choices[Math.floor(Math.random() * choices.length)];
}

const START_LANG: string = 'fr';
const POT_SIZE: number = 10;
class TranslateChaos extends Command {
    async execute({ args, message }: Context): Promise<void> {
        if (!args || args.trim().length === 0) {
            await message.reply('Please provide a text to translate.');
            return;
        }

        let text = args;
        let currentLang = START_LANG;
        let languages = [];
        for (let i = 1; i <= POT_SIZE; i++) {
            languages.push(getRandomLanguage(currentLang));
        }
        languages.push(START_LANG);

        try {
            for (const lang of languages) {
                const res = await googletrans(text, { from: currentLang, to: lang });
                currentLang = lang;
                text = res.text;
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
