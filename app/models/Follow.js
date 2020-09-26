module.exports = (sequelize, DataTypes) => {
    const Follow = sequelize.define('Follow', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        user_id: { 
            type: DataTypes.INTEGER,
            references: {
                model: 'Users'
            }
        },
        follow_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users'
            }
        }
    });

    return Follow;
}