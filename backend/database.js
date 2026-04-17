const { Sequelize } = require('sequelize');

// ORDEM: Nome da base de dados, Utilizador, Palavra-passe, Objeto de Configuração
// Substitua 'CARB26' pela sua palavra-passe real do MariaDB (HeidiSQL) se for diferente.
const sequelize = new Sequelize('noticias', 'root', 'CARB26', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false // Coloque 'true' se quiser ver os comandos SQL no terminal
});

module.exports = sequelize;