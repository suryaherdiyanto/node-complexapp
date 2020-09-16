const session = require('express-session');

const { User, Post } = require('../models').db;

exports.dashboard = function(req, res) {
    if (!req.session.user) {
        res.redirect('/');
    }
    res.render('pages/dashboard')
}

exports.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/');
}

exports.userPosts = async function(req, res) {

    try {

        let posts = await Post.findAll({
            where: {
                user_id: req.session.user.id 
            },
            attributes: ['id', 'title', 'user_id', 'createdAt'],
            include: User
        });

        return res.render('pages/profile-post', { posts: posts });
    } catch(error) {
        return res.end('Opps something went wrong!, ' + error);
    }

}

exports.saveAvatar = async function(req, res) {
    
    User.update(
        { avatar: req.file.filename },
        { 
            where: { 
                id: req.session.user.id 
            }
        }
    ).then(() => {
        req.flash('success', 'Avatar successfully updated!');
        return res.redirect('/');
    }).catch((error) => {
        return res.end('Update error ' + error);
    });
    
}