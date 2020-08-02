const { User } = require('../models').db;
const bcrypt = require('bcryptjs');

exports.homePage = function(req, res) {
    res.render('pages/home', { success: req.flash('success') });
}

exports.test = function(req, res) {
    let user = new User();
    user.test();

    res.end('Test')
}

exports.register = async function(req, res) {
    bcrypt.genSaltSync(10);

    const { username, email } = req.body;
    let { password } = req.body;

    password = bcrypt.hashSync(password);

    try {
        await User.create({ username, email, password });
        
        req.flash('success', 'Register successfully!');
        req.session.save(() => {
            res.redirect('/');
        });
    } catch (error) {
        res.send(error.toString());
    }

}