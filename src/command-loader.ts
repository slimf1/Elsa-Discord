import decache from 'decache';
import fs from 'fs';
import path from 'path';
import Command from './command';

// https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
const deepReadDir = async (dirPath: string): Promise<unknown[]> =>
  await Promise.all(
    (await fs.promises.readdir(dirPath)).map(async (entity) => {
      const filePath = path.join(dirPath, entity);
      return (await fs.promises.lstat(filePath)).isDirectory()
        ? await deepReadDir(filePath) : filePath;
    }),
  );

export interface Type<T> extends Function {
  new (...args: unknown[]): T;
}

export interface Module {
  commands?: Type<Command>[];
}

export default async function loadCommands(): Promise<Map<string, Command>> {
  const commands: Map<string, Command> = new Map();
  const files = (await deepReadDir('./dist/src/commands')).flat() as string[];
  const commandFiles = files
    .filter((file: string) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const commandFile = path.join(__dirname, file.substring(9));
    decache(commandFile);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const commandModule = require(commandFile).default as Module;
    for (const commandType of commandModule.commands || []) {
      const command = new commandType;
      commands.set(command.name(), command);
      for (const alias of command.aliases()) {
        commands.set(alias, command);
      }
    }
  }
  return commands;
}
