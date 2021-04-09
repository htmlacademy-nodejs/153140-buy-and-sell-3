'use strict';

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const ExitCode = {
  success: 0,
  error: 1
};
const HttpCode = {
  OK: 200,
  CREATED: 201,
  OK_NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
const MAX_ID_LENGTH = 6;
const API_PREFIX = `/api`;
const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

module.exports = {
  DEFAULT_COMMAND, USER_ARGV_INDEX, ExitCode, HttpCode, MAX_ID_LENGTH, API_PREFIX, Env
};
