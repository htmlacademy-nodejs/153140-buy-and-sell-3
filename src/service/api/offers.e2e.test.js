'use strict';

const express = require(`express`);
const request = require(`supertest`);
const offers = require(`./offers`);
const DataService = require(`../data-service/offers`);
const CommentService = require(`../data-service/comments`);
const {HttpCode} = require(`../../constants`);

const mockData = [{"id": `sFWH07`, "title": `Отдам в хорошие руки подшивку «Мурзилка»`, "picture": `item06.jpg`, "description": `Пользовались бережно и только по большим праздникам.`, "type": `sale`, "sum": 48757, "category": [`Журналы`, `Книги`], "comments": [{"id": `1JwWAH`, "text": `С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле. А где блок питания?`}]}, {"id": `G8tLVS`, "title": `Продам книги Стивена Кинга`, "picture": `item06.jpg`, "description": `Продаю в связи с переездом.`, "type": `sale`, "sum": 44740, "category": [`Мебель`, `Животные`, `Посуда`, `Книги`, `Журналы`], "comments": [{"id": `SsDWm5`, "text": `Неплохо, но дорого. Оплата наличными или перевод на карту? Вы что?! В магазине дешевле.`}, {"id": `oY3QIm`, "text": `Вы что?! В магазине дешевле.`}, {"id": `9iUUY0`, "text": `Почему в таком ужасном состоянии? Неплохо, но дорого.`}, {"id": `WyrRDA`, "text": `С чем связана продажа? Почему так дешёво?`}]}, {"id": `daOnR1`, "title": `Куплю детские санки`, "picture": `item12.jpg`, "description": `Если товар не понравится — верну всё до последней копейки. Товар в отличном состоянии. Бонусом отдам все аксессуары. При покупке с меня бесплатная доставка в черте города. Это настоящая находка для коллекционера!`, "type": `offer`, "sum": 68279, "category": [`Посуда`, `Журналы`], "comments": [{"id": `n8CobC`, "text": `А сколько игр в комплекте?`}, {"id": `IEt4mR`, "text": `Почему в таком ужасном состоянии?`}]}];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  offers(app, new DataService(cloneData), new CommentService(cloneData));
  return app;
};

// GET /api/offers - возвращает список объявлений
describe(`API returns a list of all offers`, () => {
  const app = createAPI();
  let response;
  beforeAll(async () => {
    response = await request(app).get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 3 offers`, () => expect(response.body.length).toBe(3));
  test(`First offer's id equals "sFWH07"`, () => expect(response.body[0].id).toBe(`sFWH07`));
});

// GET /api/offers/:offerId — возвращает полную информацию определённого объявления
describe(`API returns an offer with given id`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers/sFWH07`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Offer's title is "Отдам в хорошие руки подшивку «Мурзилка»"`, () => expect(response.body.title).toBe(`Отдам в хорошие руки подшивку «Мурзилка»`));
});

// POST /api/offers — создаёт новое объявление
describe(`API creates an offer if data is valid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/offers`).send(newOffer);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns offer created`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));
  test(`Offers count is changed`, () => request(app).get(`/offers`).expect((res) => expect(res.body.length).toBe(4)));
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };
  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newOffer)) {
      const badOffer = {...newOffer};
      delete badOffer[key];
      await request(app).post(`/offers`).send(badOffer).expect(HttpCode.BAD_REQUEST);
    }
  });
});

// PUT /api/offers/:offerId - редактирует определённое объявление
describe(`API changes existent offer`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).put(`/offers/sFWH07`).send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed offer`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));
  test(`Offer is really changed`, () => request(app).get(`/offers/sFWH07`).expect((res) => expect(res.body.title).toBe(`Дам погладить котика`)));
});

test(`API returns status code 404 when trying to change non-existent offer`, () => {
  const app = createAPI();
  const validOffer = {
    category: `Это`,
    title: `валидный`,
    description: `объект`,
    picture: `объявления`,
    type: `однако`,
    sum: 404
  };

  return request(app).put(`/offers/NOEXST`).send(validOffer).expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an offer with invalid data`, () => {
  const app = createAPI();
  const invalidOffer = {
    category: `Это`,
    title: `невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`
  };

  return request(app).put(`/offers/NOEXST`).send(invalidOffer).expect(HttpCode.BAD_REQUEST);
});

// DELETE /api/offers/:offerId - удаляет определённое объявление
describe(`API correctly deletes an offer`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/offers/sFWH07`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted offer`,  () => expect(response.body.id).toBe(`sFWH07`));
  test(`Offer count is 2 now`,  () => request(app).get(`/offers`).expect((res) => expect(res.body.length).toBe(2)));
});

test(`API refuses to delete non-existent offer`, () => {
  const app = createAPI();

  return request(app).delete(`/offers/NOEXST`).expect(HttpCode.NOT_FOUND);
});

// GET /api/offers/:offerId/comments — возвращает список комментариев определённого объявления
describe(`API returns a list of comments to given offer`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers/sFWH07/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 1 comment`, () => expect(response.body.length).toBe(1));
  test(`First comment's id is "1JwWAH"`, () => expect(response.body[0].id).toBe(`1JwWAH`));
});

// POST /api/offers/:offerId/comments — создаёт новый комментарий
describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/offers/sFWH07/comments`).send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`Comments count is changed`, () => request(app).get(`/offers/sFWH07/comments`).expect((res) => expect(res.body.length).toBe(2)));
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, () => {
  const app = createAPI();

  return request(app).post(`/offers/NOEXST/comments`).send({text: `Неважно`}).expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
  const app = createAPI();

  // TODO
  return request(app).post(`/offers/sFWH07/comments`).send({}).expect(HttpCode.BAD_REQUEST);
});

// DELETE /api/offers/:offerId/comments/:commentId — удаляет из определённой публикации комментарий с идентификатором
describe(`API correctly deletes a comment`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/offers/sFWH07/comments/1JwWAH`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`1JwWAH`));
  test(`Comments count is 0 now`, () => request(app).get(`/offers/sFWH07/comments`).expect((res) => expect(res.body.length).toBe(0)));
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app).delete(`/offers/GxdTgz/comments/NOEXST`).expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent offer`, () => {
  const app = createAPI();

  return request(app).delete(`/offers/NOEXST/comments/kqME9j`).expect(HttpCode.NOT_FOUND);
});
