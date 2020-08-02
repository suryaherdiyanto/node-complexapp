const { User } = require('../models').db;
const bcrypt = require('bcryptjs');

exports.homePage = function(req, res) {
    if (req.session.user) {
        res.redirect('/dashboard');
    }

    res.render('pages/home', { session: req.session, success: req.flash('success'), error: req.flash('error') });
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
    console.time('Register time');
    bcrypt.genSaltSync(10);

    const { username, email } = req.body;
    let { password } = req.body;

    password = bcrypt.hashSync(password);

    try {
        await User.create({ username, email, password });
        
        req.flash('success', 'Register successfully!');
        req.session.save(() => {
            console.timeEnd('Register time');

            res.redirect('/');
        });
    } catch (error) {
        res.end(error.toString());
    }

}