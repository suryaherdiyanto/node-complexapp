module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        title: { type: DataTypes.STRING},
        body: { type: DataTypes.TEXT},
        user_id: { 
            type: DataTypes.INTEGER, 
            references: {
                model: "Users"
            }
        },
    });

    return Post;
};