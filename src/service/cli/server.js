'use strict';

const chalk = require(`chalk`);
const express = require(`express`);
const fs = require(`fs`).promises;
const {HttpCode} = require(`../../constants`);

const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;

module.exports = {
  name: `--server`,
  description: `запускает сервер`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    const app = express();
    app.use(express.json());

    app.get(`/offers`, async (req, res) => {
      try {
        const fileContent = await fs.readFile(FILENAME);
        const mocks = JSON.parse(fileContent);
        res.json(mocks);
      } catch (err) {
        console.error(chalk.red(err));
        res.status(HttpCode.INTERNAL_SERVER_ERROR).send(`[]`);
      }
    });
    app.use((req, res) => res.status(HttpCode.NOT_FOUND).send(`Not found`));
    app.listen(port, () => console.info(chalk.green(`Сервер запущен на http://localhost:${DEFAULT_PORT}`)));
  }
};
