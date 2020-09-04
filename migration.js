const { sequelize } = require('./app/models/index');

function migrate() {
    sequelize.sync({ force: false }).then(() => {
        console.log('Database migrated successfully!');
    }).catch((error) => {
        console.log(error);
    });
}

migrate();