const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect
});

const Product = require('./product')(sequelize, Sequelize);
const User = require('./user')(sequelize, Sequelize);

module.exports = {
  sequelize,
  Product,
  User
};
