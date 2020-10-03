const session = require('express-session');

const { User, Post, Follow } = require('../models').db;

exports.dashboard = function(req, res) {
    if (!req.session.user) {
        res.redirect('/');
    }
    res.render('pages/dashboard')
}

exports.logout = function(req, res) {
    req.session.user = '';
    req.session.save(() => {
        return res.redirect('/');
    });
}

exports.userPosts = async function(req, res) {

    try {
        let hasFollow = false;

        const posts = await Post.findAll({
            where: {
                user_id: req.params.id
            },
            attributes: ['id', 'title', 'user_id', 'createdAt'],
            include: User
        });
        const visitedUser = await User.findOne({
            where: { id: req.params.id }
        });
        const visitedUserFollowers = await visitedUser.getFollowers();
        const visitedUserFollowing = await visitedUser.getFollowing();

        const follow = await Follow.findOne({
            where: {
                user_id: req.session.user.id,
                follow_id: visitedUser.id
            }
        });

        if (follow) {
            hasFollow = true;
        }

        return res.render('pages/profile-post', { posts: posts, visitedUser: visitedUser, hasFollow, visitedUserFollowers: visitedUserFollowers, visitedUserFollowing: visitedUserFollowing });
    } catch(error) {
        return res.end('Opps something went wrong!, ' + error);
    }

}

exports.saveAvatar = async function(req, res) {
    
    try {
        await User.update(
            { avatar: req.file.filename },
            { 
                where: { 
                    id: req.session.user.id 
                }
            }
        );
    
        const user = await User.findOne({
            where: {
                id: req.session.user.id
            }
        });
    
        req.session.user.avatar = user.avatar;
        req.session.save(() => {
            req.flash('success', 'Avatar successfully updated!');
            return res.redirect('/');
        });
    } catch(error) {
        return res.end(`Something went wrong, ${error}`)
    }
    
}