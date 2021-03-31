'use strict';

const {getMockData} = require(`../lib/get-mock-data`);
const {CategoriesService, OffersService, CommentsService, SearchService} = require(`../data-service`);
const categories = require(`./categories`);
const offers = require(`./offers`);
const search = require(`./search`);
const {Router} = require(`express`);

const app = new Router();

(async () => {
  const mockData = await getMockData();
  categories(app, new CategoriesService(mockData));
  offers(app, new OffersService(mockData), new CommentsService(mockData));
  search(app, new SearchService(mockData));
})();
module.exports = app;
