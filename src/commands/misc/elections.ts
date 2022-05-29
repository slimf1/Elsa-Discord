import Command from '../../command';
import Context from '../../context';

class Elections extends Command {
    async execute({message, args}: Context): Promise<void> {
        const results: Map<string, number> = new Map();
        const candidates = [...new Set(args.split(',').map(s => s.trim()))];
        if (candidates.length < 2 || candidates.length > 16) {
            await message.channel.send('Invalid number of candidates. Must be between 2 and 16.');
            return;
        }
        let sum = 0;
        for (const candidate of candidates) {
            const part = Math.random();
            results.set(candidate.trim(), part);
            sum += part;
        }
        const responses = [...results]
            .sort((a, b) => b[1] - a[1])
            .map(([candidate, part]) =>
                `${candidate}: **${(100 * part / sum).toFixed(2)}%**`);
        await message.channel.send('Results: ' + responses.join(' '));
    }

    name(): string {
        return 'elections';
    }

    override description(): string {
        return 'Returns elections.';
    }
}

export default {
    commands: [Elections]
};
