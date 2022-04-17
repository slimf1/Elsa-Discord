import decache from 'decache';
import fs from 'fs';
import path from 'path';
import Command from './command';

export default function loadCommands(): Map<string, Command> {
  const commands: Map<string, Command> = new Map();
  const commandFiles = fs
    .readdirSync('./dist/src/commands')
    .filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const commandFile = path.join(process.cwd(), 'dist/src/commands', file);
    decache(commandFile);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command = new (require(commandFile).default) as Command;
    commands.set(command.name(), command);
  }
  return commands;
}
