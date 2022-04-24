import util from 'util';
import { exec } from 'child_process';

const _exec = util.promisify(exec);

type ExecResult = {
  stdout: string;
  stderr: string;
};

export async function bash(command: string): Promise<ExecResult> {
  return await _exec(command);
}

export function getKeyByValue<T>(object: Record<string, T>, value: T): string | undefined {
  return Object.keys(object).find(key => object[key] === value);
}
