const { post } = require("../route");

const { Post } = require('../models').db;

exports.create = function(req, res) {
    return res.render('post/create');
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
        req.session.save(() => res.redirect(`/post/${post.id}`));
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
        return res.end('Whoops something went wrong here ' + error);
    }
}

exports.edit = async function(req, res) {
    try {
        let post = await Post.findOne({ where: { id: req.params.id } });

        if (post.user_id !== req.session.user.id) {
            req.flash('error', 'You not allowed edit this post');
            req.session.save(() => res.redirect('/dashboard'));
        }

        return res.render('post/edit', { post: post });
    } catch(error) {
        return res.end('Whoops something went wrong here ' + error)
    }
}

exports.update = function(req, res) {
    const { title, body } = req.body;
    const validator = req.validator.build({ title, body }, {
        'title': 'required|string',
        'body': 'required|string'
    });
    
    validator.validate();
    
    if (validator.hasError()) {
        return res.redirect(`/post/${req.params.id}/edit`);
    }

    Post.findOne({ where: { id: req.params.id, user_id: req.session.user.id } }).then((post) => {
        if (!post) {
            req.flash('error', 'You not allowed edit this post');
            req.session.save(() => res.redirect('/dashboard'));
        }

        Post.update({ title, body }, { where: { id: post.id, user_id: req.session.user.id } } ).then(() => {
            req.flash('success', 'Post successfully updated');
            req.session.save(() => res.redirect(`/post/${post.id}/edit`));
        }).catch((error) => {
            return res.end('Whoops something went wrong here ' + error);
        });;

    }).catch((error) => {
        return res.end('Whoops something went wrong here ' + error);
    });
}