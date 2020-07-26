module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        email: { type: DataTypes.STRING, unique: true, allowNull: false,},
        password: { type: DataTypes.STRING,  allowNull: false},
    });

    return User;
};