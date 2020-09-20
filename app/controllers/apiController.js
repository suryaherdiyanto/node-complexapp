const { Post, User } = require('../models').db;
const { Op } = require('sequelize');


exports.search = async function(req, res) {

    try {

        const posts = await Post.findAll({
            attributes: ['id', 'title', 'user_id', 'createdAt'],
            where: {
                title: {
                    [Op.like]: '%' + req.query.q + '%'
                }
            },
            order: [
                ['createdAt', 'DESC']
            ],
            include: {
                model: User,
                attributes: ['id', 'username', 'avatar']
            }
        });

        return res.status(200).json({
            data: posts,
            count: posts.length
        });

    } catch(error) {
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong!',
            stack_trace: error
        });
    }

}