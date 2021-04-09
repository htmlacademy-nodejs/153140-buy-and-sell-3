'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const offerValidator = require(`../middlewares/offerValidator`);
const offerExist = require(`../middlewares/offerExist`);
const commentValidator = require(`../middlewares/commentValidator`);

const route = new Router();

module.exports = (app, offersService, commentsService) => {
  app.use(`/offers`, route);
  // GET /api/offers - возвращает список объявлений
  route.get(`/`, (req, res) => {
    const offers = offersService.findAll();

    if (!offers || offers.length === 0) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found any offers`);
    }

    return res.status(HttpCode.OK).json(offers);
  });
  // GET /api/offers/:offerId — возвращает полную информацию определённого объявления
  route.get(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const offer = offersService.findOne(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${offerId}`);
    }

    return res.status(HttpCode.OK).json(offer);
  });
  // POST /api/offers — создаёт новое объявление
  route.post(`/`, offerValidator, (req, res) => {
    const offer = offersService.create(req.body);

    return res.status(HttpCode.CREATED).json(offer);
  });
  // PUT /api/offers/:offerId - редактирует определённое объявление
  route.put(`/:offerId`, offerValidator, offerExist(offersService), (req, res) => {
    const {offerId} = req.params;
    const offer = offersService.findOne(offerId);
    const updated = offersService.update(offerId, req.body);

    if (!updated) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${offerId}`);
    }

    return res.status(HttpCode.OK).json(offer);
  });
  // DELETE /api/offers/:offerId - удаляет определённое объявление
  route.delete(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const offer = offersService.delete(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${offerId}`);
    }

    return res.status(HttpCode.OK).json(offer);
  });
  // GET /api/offers/:offerId/comments — возвращает список комментариев определённого объявления
  route.get(`/:offerId/comments`, offerExist(offersService), (req, res) => {
    const {offerId} = req.params;
    const comments = commentsService.findAll(offerId);

    if (!comments) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found comments with ${offerId}`);
    }

    return res.status(HttpCode.OK).json(comments);
  });
  // POST /api/offers/:offerId/comments — создаёт новый комментарий
  route.post(`/:offerId/comments`, offerExist(offersService), commentValidator, (req, res) => {
    const {offer} = res.locals;
    const comment = commentsService.create(offer, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });
  // DELETE /api/offers/:offerId/comments/:commentId — удаляет из определённой публикации комментарий с идентификатором
  route.delete(`/:offerId/comments/:commentId`, offerExist(offersService), (req, res) => {
    const {offer} = res.locals;
    const {commentId} = req.params;
    const deleted = commentsService.delete(offer, commentId);

    if (!deleted) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found comment`);
    }

    return res.status(HttpCode.OK).json(deleted);
  });
};
