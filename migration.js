const { sequelize } = require('./app/models/index');

async function migrate() {
    await sequelize.sync();
    console.log('Database migrated successfully!');
}

migrate();