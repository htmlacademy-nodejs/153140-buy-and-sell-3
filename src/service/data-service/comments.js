'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentsService {
  constructor(offers) {
    this._offers = offers;
  }
  create(offer, body) {
    const newComment = Object.assign({id: nanoid(MAX_ID_LENGTH)}, body);
    this._offers.find((item) => item.id === offer.id).comments.push(newComment);
    return newComment;
  }

  delete(offer, id) {
    const comment = offer.comments.find((item) => item.id === id);

    if (!comment) {
      return null;
    }
    offer.comments = offer.comments.filter((item) => item.id !== id);
    this._offers = this._offers.filter((item) => item.id !== offer.id);
    this._offers.push(offer);
    return comment;
  }

  findAll(offerId) {
    return this._offers.find((item) => item.id === offerId).comments;
  }
}

module.exports = CommentsService;
