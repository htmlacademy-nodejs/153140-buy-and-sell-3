'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const offers = await api.getOffers();
  res.render(`main`, {offers});
});
mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.get(`/search`, async (req, res) => {
  const offers = await api.getOffers();
  try {
    const {search} = req.query;
    const results = await api.search(search);
    res.render(`search-result`, {results, offers});
  } catch (error) {
    res.render(`search-result`, {results: [], offers});
  }
});

module.exports = mainRouter;
