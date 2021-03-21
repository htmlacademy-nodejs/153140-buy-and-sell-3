'use strict';

const express = require(`express`);
const offersRoutes = require(`./routes/offers`);
const myRoutes = require(`./routes/my`);
const mainRoutes = require(`./routes/main`);

const DEFAULT_PORT = 8080;
const app = express();
app.use(`/offers`, offersRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.listen(DEFAULT_PORT, () => console.log(`Сервер запущен на http://localhost:${DEFAULT_PORT}`));
