const express = require('express');
const app = express();
const router = require('./app/route');

app.use(express.static('public'));
app.use(express.json());

app.set('view engine', 'pug');
app.set('views', './views');

app.use('/', router);

app.listen(3000);