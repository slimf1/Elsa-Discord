import axios from 'axios';
import Command from '../../command';
import Context from '../../context';

type Answer = {
    definition: string;
    permalink: string;
    thumbs_up: number;
    author: string;
    word: string;
    defid: number;
    current_vote: string;
    written_on: Date;
    example: string;
    thumbs_down: number;
}

type UrbanDictionaryResponse = {
    list: Answer[];
}

const API_BASE_URL = 'https://api.urbandictionary.com/v0';

async function fetchUrbanDictionaryDefinition(term: string): Promise<UrbanDictionaryResponse> {
    return (await axios.get(`${API_BASE_URL}/define?term=${term}`)).data as UrbanDictionaryResponse;
}

class UrbanDictionaryDefinition extends Command {
    async execute({args, message}: Context): Promise<void> {
        let answer: Answer | undefined;
        try {
            const data = await fetchUrbanDictionaryDefinition(args);
            answer = data.list[0];
        } catch (e) {
            await message.reply('Could not find definition: '+ e);
            return;
        }
        if (!answer) {
            await message.reply('Could not find definition');
            return;
        }
        await message.channel.send('**Definition** : '+ answer.definition
            .replace(/[[\]']+/g,''));
        await message.channel.send('**Examples** : '+ answer.example
            .replace(/[[\]']+/g,''));
        await message.channel.send(`(Credit: <${answer.permalink}>)`);
    }


    name(): string {
        return 'urban-dictionary';
    }


    aliases(): string[] {
        return ['ud', 'urban-dico'];
    }
}

export default {
    commands: [UrbanDictionaryDefinition]
};
