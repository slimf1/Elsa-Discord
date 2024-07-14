import Command from "../../command";
import Context from "../../context";

const isPerfectSquareCache = new Map<number, boolean>();
function isPerfectSquare(n: number): boolean {
    if (isPerfectSquareCache.has(n)) {
        return isPerfectSquareCache.get(n)!;
    }
    const sqrtN = Math.floor(Math.sqrt(n));
    const result = sqrtN * sqrtN === n;
    isPerfectSquareCache.set(n, result);
    return result;
}

function decomposeIntoFourSquares(n: number): [number, number, number, number] {
    if (isPerfectSquare(n)) {
        return [Math.floor(Math.sqrt(n)), 0, 0, 0];
    }

    let copyN = n;
    while (copyN % 4 === 0) {
        copyN /= 4;
    }
    if (copyN % 8 === 7) {
        return [0, 1, 2, Math.floor(Math.sqrt(n - 5))];
    }

    for (let a = 0; a * a <= n; a++) {
        const b = Math.floor(Math.sqrt(n - a * a));
        if (a * a + b * b === n) {
            return [a, b, 0, 0];
        }
    }

    for (let a = 0; a * a <= n; a++) {
        for (let b = 0; b * b <= n - a * a; b++) {
            const c = Math.floor(Math.sqrt(n - a * a - b * b));
            if (a * a + b * b + c * c === n) {
                return [a, b, c, 0];
            }
        }
    }

    for (let a = 0; a * a <= n; a++) {
        for (let b = 0; b * b <= n - a * a; b++) {
            for (let c = 0; c * c <= n - a * a - b * b; c++) {
                const d = Math.floor(Math.sqrt(n - a * a - b * b - c * c));
                if (a * a + b * b + c * c + d * d === n) {
                    return [a, b, c, d];
                }
            }
        }
    }

    throw new Error(); // normalement impossible
}

class LagrangeSquare extends Command {
    async execute({message, args}: Context): Promise<void> {
        try {
            const n = Number.parseInt(args);
            if (n > Number.MAX_SAFE_INTEGER) {
                await message.reply('Essayez avec un entier moins grand');
                return;
            }
            const [a, b, c, d] = decomposeIntoFourSquares(n);
            await message.reply(`Décompsition en carrés de Lagrange : ${n} = ${a}^2 + ${b}^2 + ${c}^2 + ${d}^2`);
        } catch (error) {
            await message.reply('Aucune décomposition en quatre carrés trouvée');
        }
    }

    name(): string {
        return 'lagrange-squares';
    }

    override aliases(): string[] {
        return ['4c', '4s', '4sq'];
    }
}

export default {
    commands: [LagrangeSquare]
}
