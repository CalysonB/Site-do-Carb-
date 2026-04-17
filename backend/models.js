const { DataTypes } = require('sequelize');
const sequelize = require('./database'); // Importa a ligação que criámos acima

// 1. Tabela de Notícias (Feed Principal)
const Noticia = sequelize.define('Noticia', {
    titulo: { type: DataTypes.STRING, allowNull: false },
    conteudo: { type: DataTypes.TEXT }, 
    imagem_capa: { type: DataTypes.STRING }, // Guarda o caminho: /uploads/foto.jpg
    data_postagem: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    upvotes: { type: DataTypes.INTEGER, defaultValue: 0 },
    downvotes: { type: DataTypes.INTEGER, defaultValue: 0 }
});

// 2. Tabela de Agente de Matrícula (Avisos)
const Aviso = sequelize.define('Aviso', {
    titulo: { type: DataTypes.STRING },
    mensagem: { type: DataTypes.TEXT },
    urgente: { type: DataTypes.BOOLEAN, defaultValue: false },
    data_validade: { type: DataTypes.DATEONLY }
});

// 3. Tabela de Vagas de Emprego
const Vaga = sequelize.define('Vaga', {
    cargo: { type: DataTypes.STRING },
    escritorio: { type: DataTypes.STRING },
    link_inscricao: { type: DataTypes.STRING },
    detalhes: { type: DataTypes.JSON }, // Permite guardar um objeto complexo com requisitos
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// 4. Tabela do Acervo CARB
const Acervo = sequelize.define('Acervo', {
    titulo: { type: DataTypes.STRING },
    categoria: { type: DataTypes.STRING }, // Ex: "Atas", "Estatuto"
    arquivo_url: { type: DataTypes.STRING }, // Caminho do ficheiro PDF
    ano: { type: DataTypes.INTEGER }
});

// A magia acontece aqui: Isto cria as tabelas no MariaDB se elas não existirem!
sequelize.sync().then(() => {
    console.log("✅ Tabelas da Base de Dados sincronizadas com sucesso!");
}).catch((erro) => {
    console.error("❌ Erro ao sincronizar as tabelas:", erro);
});

module.exports = { Noticia, Aviso, Vaga, Acervo, sequelize };

const Sugestao = sequelize.define('Sugestao', {
    mensagem: { type: DataTypes.TEXT, allowNull: false },
    lida: { type: DataTypes.BOOLEAN, defaultValue: false }
});