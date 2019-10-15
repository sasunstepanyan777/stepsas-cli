#!/usr/bin/env node

import minimist from 'minimist';

const argv = minimist(process.argv.slice(2), {
  boolean: true,
  alias: {
    h: 'help',
    v: 'version'
  },
  '--': true
});
