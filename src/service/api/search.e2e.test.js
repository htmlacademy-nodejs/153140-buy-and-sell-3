'use strict';

const express = require(`express`);
const request = require(`supertest`);
const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {HttpCode} = require(`../../constants`);

const mockData = [{"id": `5aPrkQ`, "title": `Продам отличную подборку фильмов на VHS`, "picture": `item08.jpg`, "description": `Если товар не понравится — верну всё до последней копейки. Звоните! Пишите! Пользовались бережно и только по большим праздникам. Торг уместен. Продаю с болью в сердце...`, "type": `sale`, "sum": 68646, "category": [`Разное`], "comments": [{"id": `tDj-zA`, "text": `А где блок питания? А сколько игр в комплекте?`}]}, {"id": `aPgCK3`, "title": `Продам отличную подборку фильмов на VHS`, "picture": `item02.jpg`, "description": `Торг уместен. Это настоящая находка для коллекционера! Две страницы заляпаны свежим кофе. Товар в отличном состоянии.`, "type": `offer`, "sum": 88838, "category": [`Посуда`, `Книги`, `Журналы`, `Животные`], "comments": [{"id": `Y5iBSr`, "text": `Почему в таком ужасном состоянии? Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца.`}]}, {"id": `r23E8e`, "title": `Куплю детские санки`, "picture": `item02.jpg`, "description": `Если товар не понравится — верну всё до последней копейки. Не пытайтесь торговаться. Цену вещам я знаю. Бонусом отдам все аксессуары. Таких предложений больше нет! Торг уместен.`, "type": `offer`, "sum": 82245, "category": [`Книги`, `Разное`, `Животные`, `Спорт`, `Посуда`], "comments": [{"id": `akkcup`, "text": `Оплата наличными или перевод на карту?`}, {"id": `Mb-ik1`, "text": `Продаю в связи с переездом. Отрываю от сердца.`}, {"id": `WBwEqI`, "text": `Совсем немного...`}, {"id": `v0ws_P`, "text": `С чем связана продажа? Почему так дешёво? Совсем немного... Почему в таком ужасном состоянии?`}]}, {"id": `JCIaNu`, "title": `Куплю детские санки`, "picture": `item03.jpg`, "description": `Продаю в связи с переездом. Мой дед не мог её сломать.`, "type": `offer`, "sum": 88372, "category": [`Посуда`, `Журналы`], "comments": [{"id": `7rIvkn`, "text": `Продаю в связи с переездом. Отрываю от сердца. Неплохо, но дорого.`}, {"id": `tVctfo`, "text": `Оплата наличными или перевод на карту? Совсем немного...`}]}];

const app = express();
app.use(express.json());
search(app, new DataService(mockData));

describe(`API returns offer based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/search`).query({query: `Продам`});
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`2 offer found`, () => expect(response.body.length).toBe(2));
  test(`Offer 1 has correct id`, () => expect(response.body[0].id).toBe(`5aPrkQ`));
});
describe(`API refuses to return offer based on search query`, () => {
  test(`API returns code 404 if nothing is found`, () => request(app).get(`/search`).query({query: `Продам свою душу`}).expect(HttpCode.NOT_FOUND));
  test(`API returns 400 when query string is absent`, () => request(app).get(`/search`).expect(HttpCode.BAD_REQUEST));
});
