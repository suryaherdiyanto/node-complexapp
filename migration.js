const { sequelize } = require('./app/models/index');

function migrate() {
    sequelize.sync({ force: true }).then(() => {
        console.log('Database migrated successfully!');
    }).catch((error) => {
        console.log(error);
    });
}

migrate();