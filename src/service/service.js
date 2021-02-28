'use strict';

const {Cli} = require(`./cli`);
const {DEFAULT_COMMAND, USER_ARGV_INDEX, ExitCode} = require(`../constants`);

const userArguments = process.argv.slice(USER_ARGV_INDEX); // массив из всех переданных аргументов
const [userCommand] = userArguments; // первый аргумент массива

if (userArguments.length === 0 || !Cli[userCommand]) { // если нет аргументов или нет команды в Cli
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.success);
}

Cli[userCommand].run(userArguments.slice(1));

