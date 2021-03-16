'use strict';

const fs = require(`fs`).promises;
const {getRandomInt, shuffle} = require(`../../utils`);
const {ExitCode} = require(`../../constants`);
const chalk = require(`chalk`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const FILE_NAME = `mocks.json`;

const FILE_SENTENCES = `./data/sentences.txt`;
const FILE_TITLES = `./data/titles.txt`;
const FILE_CATEGORIES = `./data/categories.txt`;

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};


const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const getPictureFileName = (num) => {
  const number = (num < 10) ? `0${num}` : num;
  return `item${number}.jpg`;
};

const generateOffers = (count, titles, categories, sentences) => (
  new Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    description: shuffle(sentences).slice(0, getRandomInt(1, 5)).join(` `),
    type: OfferType[Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)]],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    category: shuffle(categories).slice(0, getRandomInt(1, 5))
  }))
);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`).filter((it) => it.trim().length > 0);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

module.exports = {
  name: `--generate`,
  description: `формирует файл mocks.json`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES);
    const titles = await readContent(FILE_TITLES);
    const categories = await readContent(FILE_CATEGORIES);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > MAX_COUNT) {
      console.error(chalk.red(`Не больше ${MAX_COUNT} объявлений`));
      process.exit(ExitCode.error);
    }
    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences));
    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.success);
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.error);
    }
  }
};
