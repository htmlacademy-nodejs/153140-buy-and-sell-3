'use strict';

const express = require(`express`);
const request = require(`supertest`);
const categories = require(`./categories`);
const DataService = require(`../data-service/categories`);
const {HttpCode} = require(`../../constants`);

const mockData = [{"id": `oW4MMo`, "title": `Куплю породистого кота`, "picture": `item16.jpg`, "description": `Кажется, что это хрупкая вещь. Не пытайтесь торговаться. Цену вещам я знаю. Звоните! Пишите! Кому нужен этот новый телефон, если тут такое... Две страницы заляпаны свежим кофе.`, "type": `sale`, "sum": 9795, "category": [`Журналы`], "comments": [{"id": `HLaASp`, "text": `С чем связана продажа? Почему так дешёво?`}]}, {"id": `aPy7wA`, "title": `Продам новую приставку Sony Playstation 5`, "picture": `item09.jpg`, "description": `Пользовались бережно и только по большим праздникам. Бонусом отдам все аксессуары. Если найдёте дешевле — сброшу цену. Товар в отличном состоянии. Кажется, что это хрупкая вещь.`, "type": `offer`, "sum": 30154, "category": [`Книги`], "comments": [{"id": `3sz2E1`, "text": `Вы что?! В магазине дешевле.`}, {"id": `dTHBvh`, "text": `Неплохо, но дорого.`}, {"id": `OwYhLI`, "text": `Оплата наличными или перевод на карту? Вы что?! В магазине дешевле. Совсем немного...`}]}, {"id": `uYVeDe`, "title": `Продам коллекцию журналов «Огонёк»`, "picture": `item12.jpg`, "description": `При покупке с меня бесплатная доставка в черте города.`, "type": `sale`, "sum": 87717, "category": [`Спорт`, `Книги`, `Журналы`, `Игры`], "comments": [{"id": `s4J07Y`, "text": `А где блок питания?`}]}];

const app = express();
app.use(express.json());
categories(app, new DataService(mockData));

describe(`API returns category list`, () => {
  let response;
  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 4 categories`, () => expect(response.body.length).toBe(4));
  test(`Category names are "Журналы", "Книги", "Спорт", "Игры"`, () => expect(response.body).toEqual(expect.arrayContaining([`Журналы`, `Игры`, `Книги`, `Спорт`])));
});
