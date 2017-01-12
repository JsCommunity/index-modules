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

## Contributions

Contributions are *very* welcomed, either on the documentation or on
the code.

You may:

- report any [issue](https://github.com/JsCommunity/index-modules/issues)
  you've encountered;
- fork and create a pull request.

## License

ISC © [Julien Fontanet](https://github.com/julien-f)
