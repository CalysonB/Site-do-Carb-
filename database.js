const { Sequelize } = require('sequelize');

// ORDEM IMPORTANTE: 
// 1º: Nome do Banco ('centro_academico')
// 2º: Usuário ('root')
// 3º: Senha ('123456') <-- Coloque aqui a senha que você definiu no HeidiSQL
// 4º: Objeto de Configuração { host, dialect, etc }

const sequelize = new Sequelize('noticias', 'root', 'CARB26', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false
});

module.exports = sequelize;