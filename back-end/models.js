const { DataTypes } = require('sequelize');
const sequelize = require('./database');

// 1. Tabela Notícias (atualizada com Votos)
const Noticia = sequelize.define('Noticia', {
    titulo: { type: DataTypes.STRING, allowNull: false },
    conteudo: { type: DataTypes.TEXT },
    imagem_capa: { type: DataTypes.STRING },
    data_postagem: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    upvotes: { type: DataTypes.INTEGER, defaultValue: 0 },
    downvotes: { type: DataTypes.INTEGER, defaultValue: 0 }
});

// 2. Tabela Agente de Matrícula (Renomeado de AvisoMatricula para Aviso para manter compatibilidade)
const Aviso = sequelize.define('Aviso', {
    titulo: { type: DataTypes.STRING },
    mensagem: { type: DataTypes.TEXT },
    urgente: { type: DataTypes.BOOLEAN, defaultValue: false },
    data_validade: { type: DataTypes.DATEONLY }
});

// 3. Tabela Vagas de Emprego
const Vaga = sequelize.define('Vaga', {
    cargo: { type: DataTypes.STRING },
    escritorio: { type: DataTypes.STRING },
    detalhes: { type: DataTypes.JSON }, // Alterado para JSON conforme server.js
    link_inscricao: { type: DataTypes.STRING },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// 4. Tabela Acervo Carb
const Acervo = sequelize.define('Acervo', {
    titulo: { type: DataTypes.STRING },
    categoria: { type: DataTypes.STRING },
    arquivo_url: { type: DataTypes.STRING },
    ano: { type: DataTypes.INTEGER }
});

// Sincroniza o banco
sequelize.sync().then(() => {
    console.log("✅ Modelos sincronizados com o banco de dados.");
});

module.exports = { Noticia, Aviso, Vaga, Acervo };