# Elsa-Discord

A feature-rich Discord bot built with TypeScript, Discord.js, and TypeORM. Combines utility management, gaming features, and entertainment commands in a single bot.

## Features

- **Modular command architecture** - Easy to extend with new commands
- **Database integration** - SQLite with TypeORM for persistent data
- **Hot reload support** - Update commands without restarting the bot
- **Permission-based access** - Role and channel-based authorization
- **Custom commands** - Users can create custom commands dynamically
- **Multiple integrations** - Pokemon, Valorant, translation, and more

## Setup

### Prerequisites

- Node.js 16.x - 17.x
- npm or yarn
- A Discord bot token

### Installation

1. Rename `.env.example` to `.env` and fill in the required values:

The following environment variables are required:
| Variable | Description |
| --- | --- |
| DISCORD_TOKEN | The Discord bot token |
| TRIGGER | The trigger for the bot commands |
| MAINTAINER | The Discord ID of the bot maintainer |
| AUTHORIZED_ROLES | The Discord IDs of the roles that are allowed to use the bot (separated with ; character) |
| AUTHORIZED_CHANNELS | The Discord IDs of the channels that are allowed to use the bot (separated with ; character) |
| LOG_DB | Set to `true` if you want to log every database query |

## Commands

### Dev commands

* `command-list` - Lists all commands 
* `hot-reload` - Reloads the bot
* `info` - Shows information about the bot
* `kill` - Kills the bot process
* `ping` - Pong!
* `tts` - Sends a message as TTS (text-to-speech)
* `uptime` - Shows the uptime of the bot

### Discord specific commands

* `clean-channel [channelID]` - Delete at most 100 messages from a channel

### Misc commands

* `add-custom-command [command name], [content]` - Adds a custom command
* `delete-custom-command [command name]` - Deletes a custom command
* `list-custom-commands` - Lists all custom commands

### Pokemon commands

* `data [pokemon]` - Shows the data of a pokemon
* `rand-poke` - Shows a random pokemon
