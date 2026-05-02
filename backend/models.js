import { DataTypes } from 'sequelize';
import sequelize from './database.js';

export const Noticia = sequelize.define('Noticia', {
    titulo: { type: DataTypes.STRING, allowNull: false },
    conteudo: { type: DataTypes.TEXT }, 
    imagem_capa: { type: DataTypes.STRING }, 
    data_postagem: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    upvotes: { type: DataTypes.INTEGER, defaultValue: 0 },
    downvotes: { type: DataTypes.INTEGER, defaultValue: 0 }
});

export const Aviso = sequelize.define('Aviso', {
    titulo: { type: DataTypes.STRING },
    mensagem: { type: DataTypes.TEXT },
    urgente: { type: DataTypes.BOOLEAN, defaultValue: false },
    data_validade: { type: DataTypes.DATEONLY }
});

export const Vaga = sequelize.define('Vaga', {
    cargo: { type: DataTypes.STRING },
    escritorio: { type: DataTypes.STRING },
    link_inscricao: { type: DataTypes.STRING },
    detalhes: { type: DataTypes.JSON }, 
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true }
});

export const Acervo = sequelize.define('Acervo', {
    titulo: { type: DataTypes.STRING },
    categoria: { type: DataTypes.STRING }, 
    arquivo_url: { type: DataTypes.STRING }, 
    ano: { type: DataTypes.INTEGER }
});

export const Sugestao = sequelize.define('Sugestao', {
    mensagem: { type: DataTypes.TEXT, allowNull: false },
    lida: { type: DataTypes.BOOLEAN, defaultValue: false }
});

export { sequelize };