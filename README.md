# About

async-to-generator is a babel macro to transform async functions to generator functions. 

The intent is primarily to facilitate type-safety in libraries (like mobx-state-tree) where generators are used (for being interceptable) with same semantics as async/await. 

## Example

Source:

```js
import a2g from '@ts-delight/async-to-generator.macro';
import {flow} from 'mobx-state-tree';

flow(a2g(async () => {
  const result = await fetch("/data");
}));
```

Compiled output:

```js
import {flow} from 'mobx-state-tree';

flow(function* () {
  const result = yield fetch("/data");
});
```

## Installation

This utility is implemented as a [babel-macro](https://github.com/kentcdodds/babel-plugin-macros).

Refer babel's [setup instructions](https://babeljs.io/setup) to learn how to setup your project to use [babel](https://babeljs.io) for compilation. Usage with tsc (only) is not supported.

1. Install `babel-plugin-macros` and `async-to-generator.macro`:

```sh
npm install --save-dev babel-plugin-macros @ts-delight/async-to-generator.macro
```

2. Add babel-plugin-macros to .babelrc (if not already preset):

```js
// .babelrc

module.exports = {
  presets: [
    '@babel/preset-typescript',
    // ... other presets
  ],
  plugins: [
    'babel-plugin-macros',
    // ... other plugins
  ],
};
```

## License

MIT
