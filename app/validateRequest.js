const homeController = require('../app/controllers/homeController');

exports.register = async function(req, res, next) {
    let { username, email, password } = req.body;
    
    const validator = req.validator.build({ username, email, password }, {
        'username': 'required|string',
        'email': 'required|string|email',
        'password': 'required|min:6'
    });

    const validation = await validator.validate();

    if (validation.status === 'error') {
        req.flash('inputs', { username, email });
        req.flash('validationErrors', validation.data);

        req.session.save(() => {
            res.redirect('/');
        });
    } else {
        console.log(validation.data);
        next();
    }
}

exports.createPost = async function(req, res, next) {
    const { title, body } = req.body;

    const validator = req.validator.build({ title, body }, {
        'title': 'required|string',
        'body': 'required|string'
    });
    const validation = await validator.validate();

    if (validation) {
        req.flash('inputs', { title, body });
        req.flash('validationErrors', validation.data);
        req.session.save(() => {
            res.redirect('/create-post');
        });
    } else {
        req.body = validation.data;
        next();
    }
}