require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: (process.env.DB_LOG == 1) ? true : false
});

let db = {};

const models = fs.readdirSync(__dirname).filter( item => {
    return item !== 'index.js';
});

models.forEach( item => {
    const model = require(path.join(__dirname, item));
    const Model = model(sequelize, DataTypes);

    db[Model.name] = Model;
});

// Setting up association
db['Post'].belongsTo(db['User'], {
    foreignKey: 'user_id'
});
db['User'].hasMany(db['Post'], {
    foreignKey: 'user_id'
});

module.exports = { db, sequelize, Sequelize };