# index-modules [![Build Status](https://travis-ci.org/JsCommunity/index-modules.png?branch=master)](https://travis-ci.org/JsCommunity/index-modules)

> Generate an index of all modules in a directory.

## Install

Installation of the [npm package](https://npmjs.org/package/index-modules):

```
> npm install --save index-modules
```

## Usage

Generate an index for a directory:

```
> index-modules directory/
index generated directory/index.js
```

Generate indexes for all directory containing a `.index-modules`
file:

```
> index-modules --auto root/
index generated root/index.js
index generated root/directory/index.js
```

Using an index:

```js
import modules from "./modules";

modules.foo; // default export of the foo module
modules.bar; // default export of the bar module

import * as modules_ from "./modules";

modules_.foo.baz; // baz export of the foo module
```

### Lazy index (CommonJS)

> Only requires sub-modules when necessary.

```
> index-modules --cjs-lazy directory/
index generated directory/index.js
```

## Contributions

Contributions are _very_ welcomed, either on the documentation or on
the code.

You may:

- report any [issue](https://github.com/JsCommunity/index-modules/issues)
  you've encountered;
- fork and create a pull request.

## License

ISC © [Julien Fontanet](https://github.com/julien-f)
