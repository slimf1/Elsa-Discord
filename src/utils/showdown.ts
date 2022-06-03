import {md5digest} from './crypto';
import {HexColorString} from 'discord.js';

const colorCache = new Map<string, HexColorString>();

export function hashColor(name: string): HexColorString {
    if (colorCache.has(name)) {
        return colorCache.get(name)!;
    }

    const hash = md5digest(name);
    const H = parseInt(hash.substr(4, 4), 16) % 360; // 0 to 360
    const S = parseInt(hash.substr(0, 4), 16) % 50 + 40; // 40 to 89
    let L = Math.floor(parseInt(hash.substr(8, 4), 16) % 20 + 30); // 30 to 49

    const {R, G, B} = hslToRgb(H, S, L);
    const lum = R * R * R * 0.2126 + G * G * G * 0.7152 + B * B * B * 0.0722; // 0.013 (dark blue) to 0.737 (yellow)

    let HLmod = (lum - 0.2) * -150; // -80 (yellow) to 28 (dark blue)
    if (HLmod > 18) HLmod = (HLmod - 18) * 2.5;
    else if (HLmod < 0) HLmod = (HLmod) / 3;
    else HLmod = 0;
    // let mod = ';border-right: ' + Math.abs(HLmod) + 'px solid ' + (HLmod > 0 ? 'red' : '#0088FF');
    const Hdist = Math.min(Math.abs(180 - H), Math.abs(240 - H));
    if (Hdist < 15) {
        HLmod += (15 - Hdist) / 3;
    }

    L += HLmod;

    const {R: r, G: g, B: b} = hslToRgb(H, S, L);
    const toHex = (x: number) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    colorCache.set(name, `#${toHex(r)}${toHex(g)}${toHex(b)}`);
    return colorCache.get(name)!;
}

function hslToRgb(H: number, S: number, L: number) {
    const C = (100 - Math.abs(2 * L - 100)) * S / 100 / 100;
    const X = C * (1 - Math.abs((H / 60) % 2 - 1));
    const m = L / 100 - C / 2;

    let R1;
    let G1;
    let B1;
    switch (Math.floor(H / 60)) {
        case 1:
            R1 = X;
            G1 = C;
            B1 = 0;
            break;
        case 2:
            R1 = 0;
            G1 = C;
            B1 = X;
            break;
        case 3:
            R1 = 0;
            G1 = X;
            B1 = C;
            break;
        case 4:
            R1 = X;
            G1 = 0;
            B1 = C;
            break;
        case 5:
            R1 = C;
            G1 = 0;
            B1 = X;
            break;
        case 0:
        default:
            R1 = C;
            G1 = X;
            B1 = 0;
            break;
    }
    const R = R1 + m;
    const G = G1 + m;
    const B = B1 + m;
    return {R, G, B};
}
