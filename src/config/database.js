require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,
        define: {
            timestamps: true,
            underscored: true,
        },
    }
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('../models/User')(sequelize, DataTypes);
db.Category = require('../models/Category')(sequelize, DataTypes);
db.Product = require('../models/Product')(sequelize, DataTypes);
db.Order = require('../models/Order')(sequelize, DataTypes);
db.OrderItem = require('../models/OrderItem')(sequelize, DataTypes);

// Define os relacionamentos APÓS todos os modelos terem sido inicializados
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;