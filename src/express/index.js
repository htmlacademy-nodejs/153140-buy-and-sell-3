'use strict';

const express = require(`express`);
const offersRoutes = require(`./routes/offers`);
const myRoutes = require(`./routes/my`);
const mainRoutes = require(`./routes/main`);
const path = require(`path`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const app = express();
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));
app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);
app.use(`/offers`, offersRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.listen(DEFAULT_PORT, () => console.log(`Сервер запущен на http://localhost:${DEFAULT_PORT}`));
