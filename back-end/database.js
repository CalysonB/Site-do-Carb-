require('dotenv').config();
const { Sequelize } = require('sequelize');

const isTest = process.env.NODE_ENV === 'test';

// Configuração via Variáveis de Ambiente (.env)
const sequelize = isTest ?
    new Sequelize('sqlite::memory:', { logging: false }) :
    new Sequelize(
        process.env.DB_NAME || 'noticias',
        process.env.DB_USER || 'root',
        process.env.DB_PASS,
        {
            host: process.env.DB_HOST || 'localhost',
            dialect: process.env.DB_DIALECT || 'mariadb',
            port: process.env.DB_PORT || 3306,
            logging: false,
            dialectOptions: {
                connectTimeout: 60000
            },
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }
    );

module.exports = sequelize;