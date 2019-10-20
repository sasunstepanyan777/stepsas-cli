#!/usr/bin/env node

import minimist from 'minimist';

import { getCommandFilePath } from '../utils/utils';

const argv = minimist(process.argv.slice(2), {
  boolean: true,
  alias: {
    h: 'help',
    v: 'version'
  },
  '--': true
});

const command = argv['_'][0];

import(getCommandFilePath(command)).then((com): void => com.default(argv['_'][1]));
