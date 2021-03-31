'use strict';

const chalk = require(`chalk`);
const express = require(`express`);
const {HttpCode, API_PREFIX} = require(`../../constants`);
const routes = require(`../api`);

const DEFAULT_PORT = 3000;
const app = express();
app.use(express.json());
app.use(API_PREFIX, routes);

module.exports = {
  name: `--server`,
  description: `запускает сервер`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.use((req, res) => res.status(HttpCode.NOT_FOUND).send(`Not found`));
    app.listen(port, () => console.info(chalk.green(`Сервер запущен на http://localhost:${DEFAULT_PORT}`)));
  }
};
