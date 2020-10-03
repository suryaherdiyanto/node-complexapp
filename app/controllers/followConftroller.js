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

exports.followersScreen = async function(req, res) {
    try {
        const user = await User.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!user) {
            return res.status(404).end('Oops user your looking for can\'t be found');
        }

        const followers = await user.getFollowers();

        const postCount = await user.countPosts();
        const followersCount = await user.countFollowers();
        const followingCount = await user.countFollowing();

        return res.render('pages/profile-followers', { followers: followers, visitedUser: user, postCount: postCount, followersCount: followersCount, followingCount: followingCount })

    } catch(error) {
        return res.end(`Somthing went wrong! ${error}`)
    }
}

exports.followingScreen = async function(req, res) {
    try {
        const user = await User.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!user) {
            return res.status(404).end('Oops user your looking for can\'t be found');
        }

        const following = await user.getFollowing();

        const postCount = await user.countPosts();
        const followersCount = await user.countFollowers();
        const followingCount = await user.countFollowing();

        return res.render('pages/profile-following', { following: following, visitedUser: user, postCount: postCount, followersCount: followersCount, followingCount: followingCount })

    } catch(error) {
        return res.end(`Somthing went wrong! ${error}`)
    }
}