const express = require('express');
const app = express();
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('./app/models');

const http = require('http').createServer(app);
const io = require('socket.io')(http);

let sessionOptions = session({
    secret: 'fyling cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true},
    store: new SequelizeStore({
        db: sequelize,
        tableName: 'Sessions'
    })
});

io.use(function(socket, next) {
    sessionOptions(socket.request, socket.request.res, next);
});

const router = require('./app/route');
const flash = require('connect-flash');
const { validation } = require('@kodinggen/express-validator');
const moment = require('moment');
const markdown = require('markdown').markdown;

app.locals.rootPath = __dirname;
app.use(sessionOptions);
app.use(flash());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validation());

// Set global variable to views
app.use(function(req, res, next) {

    res.locals.session = req.session;
    res.locals.error = req.flash('error')[0];
    res.locals.success = req.flash('success')[0];
    res.locals.moment = moment;
    res.locals.markdown = markdown;


    next();
});

app.set('view engine', 'pug');
app.set('views', './views');

app.use('/', router);

console.log(process.env.NODE_ENV);


sequelize.authenticate().then((error) => {
    if (error) throw error;

    io.on('connection', function(socket) {
        console.log('a client connected!');

        if (socket.request.session) {
            socket.join('public', () => {

                socket.broadcast.to('public').emit('joinRoom', { user: socket.request.session.user, meessage: `${socket.request.session.user.username} joined chat room`});
    
            });
    
            socket.on('sendMessage', (data) => {
                socket.broadcast.to('public').emit('receiveMessage', { user: socket.request.session.user, message: data.message });
            });
        }

    });

    http.listen(3000, () => 'Server started at port: 3000');
});
