import util from 'util';
import {exec} from 'child_process';

export interface Dict<T> {
    [key: string | number]: T | undefined;
}
const _exec = util.promisify(exec);

type ExecResult = {
    stdout: string;
    stderr: string;
};

export async function bash(command: string): Promise<ExecResult> {
    return await _exec(command);
}

export function getKeyByValue<T>(object: Dict<T>, value: T): string | number | undefined {
    return Object.keys(object).find(key => object[key] === value);
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
