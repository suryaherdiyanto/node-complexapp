const { post } = require("../route");

const { Post } = require('../models').db;

exports.create = function(req, res) {
    return res.render('post/create', { validationErrors: req.validator.flashErrors() });
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

    Post.create({ title: title, body: body, user_id: req.session.user.id }).then((post) => {
        req.flash('success', 'Post has been created!');
        return res.redirect(`/post/${post.id}`);
    }).catch((error) => {
        return res.end('Error creating post ' + error);
    });

}

exports.show = async function(req, res) {
    try {

        let post = await Post.findOne({ where: { id: req.params.id } });
        let userPost = await post.getUser();
    
        return res.render('post/show', { post: post, user: userPost });
    } catch(error) {
        return res.end('Whoop something went wrong here ' + error);
    }
}