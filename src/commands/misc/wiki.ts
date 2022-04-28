/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import axios from 'axios';
import Command from '../../command';
import Context from '../../context';

class Wiki extends Command {
  async execute({ message, args }: Context): Promise<void> {
    if (!args) {
      await message.reply(this.description());
      return;
    }
    const searchData = await axios.post('https://fr.wikipedia.org/w/api.php', {
      'action': 'query',
      'list': 'search',
      'srsearch': args,
      'format': 'json'
    });
    const pages = searchData['query']['search'];
    if (!pages) {
      await message.reply('Aucun résultat');
      return;
    }
    let title: string = pages[0]['title'];
    if (title.toLowerCase().includes('homohnymie')) {
      title = pages[1]['title'];
    }
    const pageData = await axios.post('https://fr.wikipedia.org/w/api.php', {
      'action': 'query',
      'prop': 'extracts',
      'format': 'json',
      'exintro':  true,
      'explaintext': true,
      'titles': title
    });
    const page = pageData['query']['pages'][Object.keys(pageData['query']['pages'])[0]];
    await message.reply(page['extract']);
  }

  override name(): string {
    return 'wiki';
  }

  override description(): string {
    return 'Syntax: -wiki <keywords>';
  }
}

export default {
  commands: [Wiki],
};
