const { post } = require("../route");

const { Post } = require('../models').db;

exports.create = function(req, res) {
    return res.render('post/create', { validationErrors: req.validator.flashErrors(), success: req.flash('success')[0] });
}

exports.store = function(req, res) {
    const { title, body } = req.body;

    const validator = req.validator.build({ title, body }, {
        'title': 'required|string',
        'body': 'required|string'
    });
    validator.validate();

    if (validator.hasError()) {
        return res.redirect('/create-post');
    }

    Post.create({ title: title, body: body, user_id: req.session.user.id }).then(() => {
        req.flash('success', 'Post has been created!');
        return res.redirect('/create-post');
    }).catch((error) => {
        return res.end('Error creating post ' + error);
    });

}