# Custom Commands

You can add new commands using the `-add-custom` command. For example: `-add-custom mycommand, hello` will add a new command called `mycommand` that prints `hello`.

You can add expressions to your command. Several functions, binary operators and identifiers are supported :

### Functions

| Function | Arguments | Description | Example |
| --- | --- | --- | --- |
| `choice` | `choice(a, b, c, ...)` | Returns a random choice from the given arguments. | `choice(1, 2, 3)` => `3` |
| `dice` | `dice(a, b)` | Returns a random number between `a` and `b`. | `dice(6)` => `5` |

### Binary Operators

+, -, *, /, %, **

### Identifiers

| Identifier | Description | Example |
| --- | --- | --- |
| `command` | The name of the command being used. | `mycommand` |
| `author` | The author of the command. | `@user` |
| `channel` | The channel the command was used in. | `#channel` |	
| `guild` | The guild the command was used in. | `@guild` |
| `args` | The arguments passed to the command. | `arg1 arg2 arg3` |
| `randMember` | A random member of the guild. | `@user` |
