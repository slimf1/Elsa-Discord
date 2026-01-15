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

| Variable | Description |
| --- | --- |
| DISCORD_TOKEN | The Discord bot token from [Discord Developer Portal](https://discord.com/developers/applications) |
| TRIGGER | The prefix for bot commands (e.g., `!`, `$`) |
| MAINTAINER | Your Discord user ID for maintainer-only commands |
| AUTHORIZED_ROLES | Discord role IDs allowed to use the bot (semicolon-separated) |
| AUTHORIZED_CHANNELS | Discord channel IDs where the bot can be used (semicolon-separated) |
| LOG_DB | Set to `true` to log every database query |

2. Install dependencies:
```bash
npm install
```

3. Build and run:
```bash
npm run build && npm start
```

## Commands

### 🛠️ Dev Commands
Maintainer-only utilities for bot management.

| Command | Description |
| --- | --- |
| `command-list` | Lists all available commands |
| `hot-reload` | Reloads the bot without restart |
| `info` | Shows information about the bot |
| `kill` | Terminates the bot process |
| `ping` | Responds with latency stats |
| `tts` | Sends a message as text-to-speech |
| `uptime` | Displays bot uptime |

### 🎮 Discord Management
Server and role administration commands.

| Command | Description |
| --- | --- |
| `clean-channel [channelID]` | Delete up to 100 messages from a channel |
| `create-role [role name]` | Create a new Discord role |
| `remove-roles [userID]` | Remove roles from a user |
| `snapchat [toggle]` | Enable/disable "Snapchat mode" - messages auto-delete after 1 minute |

### 🎲 Misc Commands
Fun and utility commands for entertainment.

| Command | Description | Aliases |
| --- | --- | --- |
| `bad-translate [text]` | Translates text through 10 random languages | `translate10`, `chaos-translate`, `pot9`, `melting-pot9` |
| `bible [verse]` | Fetches Bible verses | — |
| `quran [verse]` | Fetches Quranic verses | — |
| `wiki [query]` | Wikipedia search | — |
| `urban-dictionary [term]` | Urban Dictionary lookup | — |
| `poll [question]` | Creates a reaction poll | — |
| `timer [duration]` | Sets a timer | — |
| `elections [country]` | Election information | — |
| `lagrange-squares [number]` | Lagrange's four-square theorem | — |

### 🎮 Pokémon Commands
Interact with Pokémon data and competitive gaming.

| Command | Description |
| --- | --- |
| `data [pokemon]` | Shows detailed stats, types, and abilities of a Pokémon |
| `rand-poke` | Displays a random Pokémon |
| `bdsp-sets` | Pokémon Brilliant Diamond/Shining Pearl competitive sets |
| `bdsp-tower` | Battle Tower data for BDSP |
| `bdsp-trainers` | Battle Tower trainer information |
| `kunc` | Pokémon Scarlet/Violet Tera Type data |
| `ladder [player]` | Pokémon Showdown ladder stats for a player |

### 🎯 Valorant Commands
Competitive gaming integrations.

| Command | Description |
| --- | --- |
| `valorant-rank [player]` | Display player rank and stats |
| `calls [agent]` | Valorant agent ability callouts |

### 📝 Custom Commands
Create and manage server-specific commands.

| Command | Description |
| --- | --- |
| `add-custom-command [name], [content]` | Create a new custom command |
| `delete-custom-command [name]` | Remove a custom command |
| `list-custom-commands` | View all custom commands on the server |

## Project Structure

```
src/
├── bot.ts              # Main bot class and event handlers
├── command.ts          # Base Command class
├── listener.ts         # Event listener interface
├── context.ts          # Command execution context
├── command-loader.ts   # Dynamic command/listener loading
├── http-client.ts      # HTTP utilities for API calls
├── commands/           # Command implementations
│   ├── dev/            # Developer commands
│   ├── discord/        # Discord management commands
│   ├── misc/           # Miscellaneous commands
│   ├── pokemon/        # Pokémon-related commands
│   ├── valorant/       # Valorant-related commands
│   └── custom-commands/# Custom command management
├── database/           # TypeORM database configuration
├── utils/              # Helper utilities
└── listeners/          # Event listeners
```

## Technologies

- **Discord.js v13** - Discord API wrapper
- **TypeScript** - Type-safe JavaScript
- **TypeORM** - Object-Relational Mapping with SQLite
- **Axios** - HTTP client for API requests
- **Luxon** - DateTime utilities
- **@pkmn/dex** - Pokémon data library
- **googletrans** - Translation service

## Architecture

The bot follows a modular command pattern:
- Each command implements the `Command` interface
- Commands are dynamically loaded from the `commands/` directory
- Listeners handle Discord events and can respond to commands
- Database operations are centralized through the `BotRepository`
- Permission checks are performed based on roles and channels

## Development

### Build
```bash
npm run build
```

### Run
```bash
npm start
```

### Clean build artifacts
```bash
npm run clean
```

## License

ISC
