'use strict';

const fs = require(`fs`).promises;
const {getRandomInt, shuffle} = require(`../../utils`);
const {ExitCode, MAX_ID_LENGTH} = require(`../../constants`);
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const MAX_COMMENTS = 4;
const FILE_NAME = `mocks.json`;

const FILE_SENTENCES = `./data/sentences.txt`;
const FILE_TITLES = `./data/titles.txt`;
const FILE_CATEGORIES = `./data/categories.txt`;
const FILE_COMMENTS = `./data/comments.txt`;

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

const generateComments = (count, comments) => (
  new Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `),
  }))
);

const generateOffers = (count, titles, categories, sentences, comments) => (
  new Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    description: shuffle(sentences).slice(0, getRandomInt(1, 5)).join(` `),
    type: OfferType[Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)]],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    category: shuffle(categories).slice(0, getRandomInt(1, 5)),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
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
    const files = [FILE_TITLES, FILE_SENTENCES, FILE_CATEGORIES, FILE_COMMENTS];
    const requests = files.map((item) => readContent(item));
    const result = await Promise.all(requests);
    const [titles, sentences, categories, comments] = result;

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > MAX_COUNT) {
      console.error(chalk.red(`Не больше ${MAX_COUNT} объявлений`));
      process.exit(ExitCode.error);
    }
    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences, comments));
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
