#!/usr/bin/env node

var promisify = require('promise-toolbox').promisify

var camelCase = require('lodash/camelCase')
var join = require('path').join
var map = require('lodash/map')
var readdir = promisify.call(require('fs').readdir)
var stat = promisify.call(require('fs').stat)
var writeFile = promisify.call(require('fs').writeFile)

// ===================================================================

function _log () {
  for (var i = 0, n = arguments.length; i < n; ++i) {
    this.write(arguments[i])
    this.write('\n')
  }
}

function log () {
  _log.apply(process.stdout, arguments)
}

function warn () {
  _log.apply(process.stderr, arguments)
}

function fatal () {
  _log.apply(process.stderr, arguments)
  process.exit(1)
}

// -------------------------------------------------------------------

function removeSuffix (str, sfx) {
  var strLength = str.length
  var sfxLength = sfx.length

  var pos = strLength - sfxLength
  if (pos < 0 || str.indexOf(sfx, pos) !== pos) {
    return false
  }

  return str.slice(0, pos)
}

// ===================================================================

function indexModules (dir) {
  var content = [
    '//',
    '// This file has been generated by [index-modules](https://npmjs.com/history)',
    '//',
    '',
    'const defaults = {}',
    'export { defaults as default }',
    ''
  ]

  return readdir(dir).then(function (entries) {
    var index = join(dir, 'index.js')
    return Promise.all(map(entries, function (entry) {
      return entry !== 'index.js' && stat(join(dir, entry)).then(function (stats) {
        var base
        if (stats.isDirectory()) {
          base = entry
        } else if (!(
          stats.isFile() && (
            (base = removeSuffix(entry, '.coffee')) ||
            (base = removeSuffix(entry, '.js'))
          )
        )) {
          return
        }

        var identifier = camelCase(base)
        content.push(
          'import ' + identifier + " from './" + base + "'",
          'defaults.' + identifier + ' = ' + identifier,
          'export * as ' + identifier + " from './" + base + "'",
          ''
        )
      }, function (error) {
        warn('failed to read ' + dir, error)
      })
    })).then(function () {
      return writeFile(index, content.join('\n')).then(function () {
        log('index generated ' + index)
      }, function (error) {
        warn('failed to write ' + index, error)
      })
    }, function (error) {
      warn('failed to generate ' + index, error)
    })
  })
}

function findDirs (dir) {
  return readdir(dir).then(function (entries) {
    return Promise.all(map(entries, function (entry) {
      var path = join(dir, entry)
      return stat(path).then(function (stats) {
        if (stats.isDirectory()) {
          return findDirs(path)
        }
        if (entry === '.index-modules' && stats.isFile()) {
          return indexModules(dir)
        }
      }, function (error) {
        warn('cannot read ' + entry, error)
      })
    }))
  }, function (error) {
    warn('failed to read ' + dir, error)
  })
}

// ===================================================================

(function main (args) {
  var n = args.length

  if (!n) {
    return log(
      'Usage: index-modules <dir>...',
      '       index-modules --auto <root dir>'
    )
  }

  if (args[0] === '--auto') {
    if (n < 2) {
      fatal('missing param <root dir>')
    }

    findDirs(args[1])
  } else {
    Promise.all(map(args, indexModules))
  }
})(process.argv.slice(2))
