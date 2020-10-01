const { User } = require('../models').db;
const bcrypt = require('bcryptjs');

exports.homePage = function(req, res) {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }

    return res.render('pages/home', { inputs: req.flash('inputs') });
}

exports.test = function(req, res) {
    let user = new User();
    user.test();

    res.end('Test')
}

exports.login = async function(req, res) {
    console.time('Login time');

    const { username, password } = req.body;

    user = await User.findOne({ where: { username: username } });


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
    req.session.save(() => {
        returnres.redirect('/dashboard');
    });
}

exports.register = async function(req, res) {

    try {
        let { username, email, password } = req.body;
    
        const validator = req.validator.build({ username, email, password }, {
            'username': 'required|string',
            'email': 'required|string|email',
            'password': 'required|min:6'
        });
    
        const validatorFail = await validator.validate();
        if (validatorFail) {
            req.flash('inputs', { username, email });
            req.session.save(() => {

                return res.redirect('/');
            });
        }

        bcrypt.genSaltSync(10);
        password = bcrypt.hashSync(password);
    
        await User.create({ username, email, password });
    
        req.flash('success', 'Register successfully!');
        req.session.save(() => {
            return res.redirect('/');
        });

    } catch(error) {
        return res.end('Something went wrong!, ' + error);
    };

}