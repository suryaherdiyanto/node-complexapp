const { User } = require('../models').db;
const bcrypt = require('bcryptjs');

exports.homePage = function(req, res) {

    return res.render('pages/home', { inputs: req.flash('inputs'), validationErrors: req.flash('validationErrors')[0] });
}

exports.test = function(req, res) {
    let user = new User();
    user.test();

    res.end('Test')
}

exports.login = async function(req, res) {

    const { username, password } = req.body;

    user = await User.findOne({ where: { username: username } });


    if (!user) {
        req.flash('error', 'Could not find user with that username');

        req.session.save(() => {
            return res.redirect('/');
        })
    } else {
        if (!bcrypt.compareSync(password, user.password)) {
            req.flash('error', 'Invalid credentials!');
            req.session.save(() => {
                return res.redirect('/');
            });
        } else {
            
            req.session.user = user.toJSON();
            req.session.save(() => {
                return res.redirect('/dashboard');
            });
        }
    }


}

exports.register = async function(req, res) {

    try {
        let { username, email, password } = req.body;

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