'use strict';

const packageJsonFile = require(`../../../package.json`);
const chalk = require(`chalk`);

module.exports = {
  name: `--version`,
  description: `выводит номер версии`,
  run() {
    const version = packageJsonFile.version;
    console.info(chalk.blue(version));
  }
};
