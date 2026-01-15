import axios from 'axios';
import Command from '../../command';
import Context from '../../context';

type AyahData = {
    numberInSurah: number;
    text: string;
    surah: {
        number: number;
        englishName: string;
        name: string;
    };
};

type AyahResponse = {
    data: AyahData;
};

const API_BASE_URL = 'https://api.alquran.cloud/v1';

async function fetchAyah(
    surah: number,
    ayah: number,
    edition: string
): Promise<AyahResponse> {
    return (
        await axios.get(
            `${API_BASE_URL}/ayah/${surah}:${ayah}/${edition}`
        )
    ).data as AyahResponse;
}

class QuranRandomVerse extends Command {
    async execute({ message }: Context): Promise<void> {
        try {
            const surah = Math.floor(Math.random() * 114) + 1;
            const ayah = Math.floor(Math.random() * 7) + 1;

            const arabic = await fetchAyah(surah, ayah, 'ar.alafasy');
            const english = await fetchAyah(surah, ayah, 'en.hilali');
            const french = await fetchAyah(surah, ayah, 'fr.hamidullah');

            await message.channel.send(
                `📖 **Quran — Surah ${arabic.data.surah.englishName} (${arabic.data.surah.number}), Ayah ${arabic.data.numberInSurah}**`
            );

            await message.channel.send(
                `**Arabic 🇸🇦:**\n${arabic.data.text}`
            );

            await message.channel.send(
                `**English 🇬🇧:**\n${english.data.text}`
            );

            await message.channel.send(
                `**French 🇫🇷:**\n${french.data.text}`
            );
        } catch (e) {
            await message.reply('Could not fetch a Quran verse.');
        }
    }

    name(): string {
        return 'quran';
    }

    aliases(): string[] {
        return ['ayah', 'verse', 'quran-random'];
    }
}

export default {
    commands: [QuranRandomVerse]
};
