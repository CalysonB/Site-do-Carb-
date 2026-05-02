import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('noticias', 'root', 'CARB26', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false
});

export default sequelize;