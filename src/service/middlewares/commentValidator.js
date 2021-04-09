'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (req, res, next) => {
  const commentKeys = [`text`];
  const comment = req.body;
  const keys = Object.keys(comment);
  const keysExists = commentKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
  }

  return next();
};
