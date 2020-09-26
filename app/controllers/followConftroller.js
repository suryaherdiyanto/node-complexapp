const { User, Follow } = require('../models').db;
const { Op } = require('sequelize');

exports.follow = async function(req, res) {

    try {
        const followedUser = await User.findOne({
            where: {
                id: req.params.userId
            }
        });
    
        if (!followedUser) {
            return res.status(404).end('User you follow not found!');
        }

        await followedUser.addFollowers(req.session.user.id);
        req.flash('success', `Successfully follow ${followedUser.username}`);
        req.session.save(() => {
            return res.redirect(`/user/${req.params.userId}`);
        });
    } catch(error) {
        return res.end(`Something went wrong! ${error}`);
    }
    
}

exports.unfollow = async function(req, res) {
    try {
        const unfollowUser = await User.findOne({
            where: {
                id: req.params.userId
            }
        });
        const checkFollowing = await Follow.count({
            where: {
                user_id: req.params.userId,
            },
            [Op.and]: {
                follow_id: unfollowUser.id
            }
        });
    
        if (!unfollowUser) {
            return res.status(404).end('User you want unfollow not found!');
        }

        if (checkFollowing === 0) {
            return res.status(404).end(`User ${unfollowUser.username} are not in your following list`);
        }

        await unfollowUser.removeFollowers(req.session.user.id);
        req.flash('success', `Successfully unfollow ${unfollowUser.username}`);
        req.session.save(() => {
            return res.redirect(`/user/${req.params.userId}`);
        });
    } catch(error) {
        return res.end(`Something went wrong! ${error}`);
    }
}