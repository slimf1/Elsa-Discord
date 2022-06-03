import {createHash} from 'crypto';

export function md5digest(str: string): string {
    return createHash('md5').update(str).digest().toString('hex');
}
