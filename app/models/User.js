module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        username: { type: DataTypes.STRING, unique: true, allowNull: false},
        email: { type: DataTypes.STRING, unique: true, allowNull: false},
        password: { type: DataTypes.STRING,  allowNull: false},
        avatar: { type: DataTypes.STRING.BINARY, allowNull: true}
    });

    User.prototype.test = function() {
        console.log('test');
    };

    return User;
};