const {Sequelize} = require('sequelize')

const useSSL = process.env.DB_SSL === 'true'

module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialectOptions: useSSL ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
    logging: false
  }
)