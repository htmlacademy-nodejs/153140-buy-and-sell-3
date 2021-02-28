'use strict';

const packageJsonFile = require(`../../../package.json`);

module.exports = {
  name: `--version`,
  description: `выводит номер версии`,
  run() {
    const version = packageJsonFile.version;
    console.info(version);
  }
};
