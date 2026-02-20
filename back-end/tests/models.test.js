const { Sequelize, DataTypes } = require('sequelize');
const { Noticia, Aviso, Vaga, Acervo } = require('../models');

// Mock da conexão para usar SQLite em memória nos testes
const sequelizeTest = new Sequelize('sqlite::memory:', { logging: false });

describe('Sequelize Models Integration', () => {
    beforeAll(async () => {
        await sequelizeTest.sync({ force: true });
    });

    test('Modelo Noticia: deve criar uma notícia com sucesso', async () => {
        const noticia = await Noticia.create({
            titulo: "Test Noticia",
            conteudo: "Conteúdo longo",
            imagem_capa: "/img.jpg"
        });
        expect(noticia.id).toBeDefined();
        expect(noticia.titulo).toBe("Test Noticia");
    });

    test('Modelo Aviso: deve criar um aviso urgente', async () => {
        const aviso = await Aviso.create({
            titulo: "Urgente",
            mensagem: "Aviso importante",
            urgente: true
        });
        expect(aviso.urgente).toBe(true);
    });

    test('Modelo Vaga: deve criar uma vaga com JSON de detalhes', async () => {
        const vaga = await Vaga.create({
            cargo: "Estagiário",
            escritorio: "CARB",
            detalhes: { bolsa: 1000 }
        });
        expect(vaga.detalhes.bolsa).toBe(1000);
    });

    test('Modelo Acervo: deve criar item com ano específico', async () => {
        const item = await Acervo.create({
            titulo: "Estatuto",
            categoria: "Legal",
            ano: 2024
        });
        expect(item.ano).toBe(2024);
    });
});
