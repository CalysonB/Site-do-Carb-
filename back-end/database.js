require('dotenv').config();
const { Sequelize } = require('sequelize');

// Configuração via Variáveis de Ambiente (.env)
const sequelize = new Sequelize(
    process.env.DB_NAME || 'noticias', 
    process.env.DB_USER || 'root', 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: process.env.DB_DIALECT || 'mariadb',
        port: process.env.DB_PORT || 3306,
        logging: false
    }
);

module.exports = sequelize;