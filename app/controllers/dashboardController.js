const session = require('express-session');
const {Op} = require('sequelize');

const { User, Post, Follow } = require('../models').db;

exports.dashboard = async function(req, res) {
    try {

        let following = await Follow.findAll({
            where: {
                user_id: req.session.user.id
            },
            raw: true
        });
    
        let posts = await Post.findAll({
            where: {
                user_id: {
                    [Op.in]: [...following.map(item => item.follow_id)]
                }
            },
            include: User,
            order: [
                ['createdAt', 'DESC']
            ]
        });
    
        res.render('pages/dashboard', { feeds: posts });
    } catch(error) {
        res.end(`Somthing went wrong, ${error} `);
    }
}

exports.logout = function(req, res) {
    req.session.user = null;
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
        const visitedUserFollowers = await visitedUser.countFollowers();
        const visitedUserFollowing = await visitedUser.countFollowing();

        const follow = await Follow.findOne({
            where: {
                user_id: req.session.user.id,
                follow_id: visitedUser.id
            }
        });

        if (follow) {
            hasFollow = true;
        }

        return res.render('pages/profile-post', { posts: posts, visitedUser: visitedUser, hasFollow, followersCount: visitedUserFollowers, followingCount: visitedUserFollowing });
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