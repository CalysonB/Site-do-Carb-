const { DataTypes } = require('sequelize');
const sequelize = require('./database');

// 1. Tabela Notícias
const Noticia = sequelize.define('Noticia', {
    titulo: { type: DataTypes.STRING, allowNull: false },
    conteudo: { type: DataTypes.TEXT }, // TEXT para textos longos
    imagem_capa: { type: DataTypes.STRING }, // Salva o caminho: /uploads/foto.jpg
    data_postagem: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

// 2. Tabela Agente de Matrícula (Avisos)
const AvisoMatricula = sequelize.define('AvisoMatricula', {
    titulo: { type: DataTypes.STRING },
    mensagem: { type: DataTypes.TEXT },
    urgente: { type: DataTypes.BOOLEAN, defaultValue: false },
    data_validade: { type: DataTypes.DATEONLY }
});

// 3. Tabela Vagas de Emprego
const Vaga = sequelize.define('Vaga', {
    cargo: { type: DataTypes.STRING },
    escritorio: { type: DataTypes.STRING },
    link_inscricao: { type: DataTypes.STRING },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// 4. Tabela Acervo Carb
const Acervo = sequelize.define('Acervo', {
    titulo: { type: DataTypes.STRING },
    categoria: { type: DataTypes.STRING }, // Ex: "Atas", "Estatuto"
    arquivo_url: { type: DataTypes.STRING }, // Caminho do PDF
    ano: { type: DataTypes.INTEGER }
});

// Sincroniza (Cria as tabelas no MariaDB se não existirem)
sequelize.sync();

module.exports = { Noticia, AvisoMatricula, Vaga, Acervo };