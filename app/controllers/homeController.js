const { User } = require('../models').db;
const bcrypt = require('bcryptjs');

exports.homePage = function(req, res) {
    if (req.session.user) {
        res.redirect('/dashboard');
    }

    res.render('pages/home', { session: req.session, success: req.flash('success'), error: req.flash('error'), validationErrors: req.validator.flashErrors(), inputs: req.flash('inputs') });
}

exports.test = function(req, res) {
    let user = new User();
    user.test();

    res.end('Test')
}

exports.login = async function(req, res) {
    console.time('Login time');

    const { username, password } = req.body;

    console.time('User query time');
    user = await User.findOne({ where: { username: username } });
    console.timeEnd('User query time');


    if (!user) {
        req.flash('error', 'Could not find user with that username');

        req.session.save(() => {
            res.redirect('/');
        })
    }

    if (!bcrypt.compareSync(password, user.password)) {
        req.flash('error', 'Invalid credentials!');
        res.redirect('/');
    }

    req.session.user = user.toJSON();
    console.timeEnd('Login time');
    res.redirect('/dashboard');
}

exports.register = async function(req, res) {
    bcrypt.genSaltSync(10);
    let { username, email, password } = req.body;

    const validator = req.validator.build({ username, email, password }, {
        'username': 'required|string',
        'email': 'required|string|email',
        'password': 'required|min:6'
    });

    validator.validate();

    if (validator.hasError()) {
        req.flash('inputs', { username, email, password });
        return res.redirect('/');
    }

    password = bcrypt.hashSync(password);

    User.create({ username, email, password }).then(() => {
        req.flash('success', 'Register successfully!');
        req.session.save(() => {
            return res.redirect('/');
        });
    }).catch(() => {
        if (error === 'validation error') {
            res.redirect('/');
        }
        res.end(error.toString());
    });

}