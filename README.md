# Unalias

## Installation

```
npm install unalias
```

## Usage

```typescript
import { Resolver, Aliases } from 'unalias';

const aliases: Aliases = {
    Al: ["Alyson", "Alyssa", "Alfred", "Albert", "Alphonse"],
    Sam: ["Sam", "Samuel", "Samson", "Samantha"],
    All: ["Al", "Sam"],
    NoSam: ["All", "-Sam"],
};

const resolver = new Resolver(aliases);

resolver.resolveOne('All');
// [
//   'Alyson',   'Alyssa',
//   'Alfred',   'Albert',
//   'Alphonse', 'Samuel',
//   'Samson',   'Samantha'
// ]

// Subtract Als from All.
resolver.resolveAll(['All', '-Al']);
// [ 'Samuel', 'Samson', 'Samantha' ]

resolver.resolveOne('NoSam');
// [
//   "Alyson",
//   "Alyssa",
//   "Alfred",
//   "Albert",
//   "Alphonse",
// ]
```

## Use Cases

- Group values and combine the groups with creating new aliases
- Give static (nick)names to values that can possibly change