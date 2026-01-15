import axios from 'axios';
import Command from '../../command';
import Context from '../../context';

type BibleVerseData = {
    book_id: string;
    book: string;
    chapter: number;
    verse: number;
    text: string;
};

type BibleVerseResponse = {
    translation: {
        identifier: string;
        name: string;
        language: string;
        language_code: string;
        license: string;
    };
    random_verse: BibleVerseData;
};

const API_BASE_URL = 'https://bible-api.com';

async function fetchRandomVerse(): Promise<BibleVerseResponse> {
    return (
        await axios.get(`${API_BASE_URL}/data/web/random`)
    ).data as BibleVerseResponse;
}

class BibleRandomVerse extends Command {
    async execute({ message }: Context): Promise<void> {
        try {
            const response = await fetchRandomVerse();
            const verse = response.random_verse;

            const reference = `${verse.book} ${verse.chapter}:${verse.verse}`;

            await message.channel.send(
                `📖 **Bible — ${reference}**`
            );

            await message.channel.send(
                `**${response.translation.name}:**\n${verse.text}`
            );
        } catch (e) {
            await message.reply('Could not fetch a Bible verse.');
        }
    }

    name(): string {
        return 'bible';
    }

    aliases(): string[] {
        return ['verse', 'bible-random'];
    }
}

export default {
    commands: [BibleRandomVerse]
};