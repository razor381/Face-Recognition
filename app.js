const express = require('express');
const path = require('path');
const viewRouter = require('./Routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'Views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/', viewRouter);

module.exports = app;
