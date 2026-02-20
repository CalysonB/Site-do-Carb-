process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../server');
const sequelize = require('../database');
const { Noticia } = require('../models');

describe('API Integration Tests', () => {
    // Força uso da chave de teste/padrão se não houver .env carregado no runner
    const API_KEY = process.env.API_KEY || "CARB_SECURE_KEY_2026_X9Z";

    beforeAll(async () => {
        // Garante que estamos usando o banco de teste em memória
        process.env.NODE_ENV = 'test';
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        // Encerra a conexão para evitar leakes
        await sequelize.close();
    });

    describe('GET /api/status', () => {
        test('deve retornar status online', async () => {
            const res = await request(app).get('/status');
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('online');
        });
    });

    describe('GET /api/noticias', () => {
        test('deve listar notícias paginadas', async () => {
            await Noticia.create({ titulo: "Noticia de Teste", conteudo: "Texto" });
            const res = await request(app).get('/api/noticias');
            expect(res.statusCode).toBe(200);
            expect(res.body.noticias.length).toBeGreaterThan(0);
        });

        test('deve lidar com página vazia ou erro gracefully', async () => {
            const res = await request(app).get('/api/noticias?page=999');
            expect(res.statusCode).toBe(200);
            expect(res.body.noticias.length).toBe(0);
        });
    });

    describe('POST /api/upload', () => {
        test('deve bloquear upload sem API Key', async () => {
            const res = await request(app)
                .post('/api/upload')
                .send({ titulo: "Hacker" });
            expect(res.statusCode).toBe(403);
        });

        test('deve aceitar upload com API Key e aplicar filtro de palavrões', async () => {
            const res = await request(app)
                .post('/api/upload')
                .set('x-api-key', API_KEY)
                .send({
                    titulo: "Noticia de Porra",
                    conteudo: "Conteúdo foda",
                    imagem: { nome: "teste.jpg", base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==" }
                });
            expect(res.statusCode).toBe(200);
            // Verifica se criou notícia filtrada
            const noticia = await Noticia.findByPk(res.body.id);
            expect(noticia.titulo).toBe("Noticia de P****");
            expect(noticia.conteudo).toBe("Conteúdo f***");
        });

        test('deve lidar com upload sem imagem', async () => {
            const res = await request(app)
                .post('/api/upload')
                .set('x-api-key', API_KEY)
                .send({
                    titulo: "Sem Imagem",
                    conteudo: "Apenas texto"
                });
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('sucesso');
        });

        test('deve bloquear arquivos que não são imagens (Magic Number)', async () => {
            const res = await request(app)
                .post('/api/upload')
                .set('x-api-key', API_KEY)
                .send({
                    titulo: "Spy",
                    imagem: { nome: "spy.txt", base64: "SGVsbG8=" }
                });
            expect(res.statusCode).toBe(400);
            expect(res.body.erro).toContain("Tipo de arquivo não permitido");
        });
    });

    describe('POST /api/noticias/:id/voto', () => {
        test('deve registrar um voto up', async () => {
            const n = await Noticia.create({ titulo: "Vota em mim", conteudo: "T" });
            const res = await request(app)
                .post(`/api/noticias/${n.id}/voto`)
                .send({ tipo: 'up' });
            expect(res.statusCode).toBe(200);
            expect(res.body.up).toBe(1);
        });

        test('deve registrar um voto down', async () => {
            const n = await Noticia.create({ titulo: "Vota contra", conteudo: "T" });
            const res = await request(app)
                .post(`/api/noticias/${n.id}/voto`)
                .send({ tipo: 'down' });
            expect(res.statusCode).toBe(200);
            expect(res.body.down).toBe(1);
        });

        test('deve retornar 404 para notícia inexistente', async () => {
            const res = await request(app)
                .post('/api/noticias/9999/voto')
                .send({ tipo: 'up' });
            expect(res.statusCode).toBe(404);
        });
    });

    describe('GET /api/public-listas', () => {
        test('deve listar avisos, vagas e acervo', async () => {
            const resAvisos = await request(app).get('/api/avisos');
            const resVagas = await request(app).get('/api/vagas');
            const resAcervo = await request(app).get('/api/acervo');
            expect(resAvisos.statusCode).toBe(200);
            expect(resVagas.statusCode).toBe(200);
            expect(resAcervo.statusCode).toBe(200);
        });
    });
});
