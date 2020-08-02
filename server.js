const express = require('express');
const app = express();
const router = require('./app/route');
const flash = require('connect-flash');

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const { sequelize } = require('./app/models');

app.use(session({
    secret: 'fyling cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true},
    store: new SequelizeStore({
        db: sequelize,
        tableName: 'Sessions'
    })
}));
app.use(flash());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'pug');
app.set('views', './views');

app.use('/', router);

sequelize.authenticate().then((error) => {
    if (error) throw error;

    app.listen(3000);
})
