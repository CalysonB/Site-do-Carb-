process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../server');
const sequelize = require('../database');
const { Noticia, Aviso, Vaga, Acervo } = require('../models');
const { sanitizeContent } = require('../utils/contentFilter');
const path = require('path');
const fs = require('fs');

describe('Full Coverage Test Suite', () => {
    const API_KEY = process.env.API_KEY || "CARB_SECURE_KEY_2026_X9Z";

    beforeAll(async () => {
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'warn').mockImplementation(() => { });
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    // 1. UNIT TESTS: Content Filter
    describe('Content Filter Logic', () => {
        test('deve censurar palavrões', () => {
            expect(sanitizeContent("porra")).toBe("p****");
            expect(sanitizeContent("caralho")).toBe("c******");
        });
        test('deve ignorar nulos/vazios', () => {
            expect(sanitizeContent(null)).toBe(null);
            expect(sanitizeContent("")).toBe("");
        });
    });

    // 2. MODEL TESTS
    describe('Database Models', () => {
        test('Noticia: deve persistir corretamente', async () => {
            const n = await Noticia.create({ titulo: "T", conteudo: "C" });
            expect(n.id).toBeDefined();
        });
    });

    // 3. API TESTS
    describe('API Endpoints', () => {
        test('GET /status deve retornar online', async () => {
            const res = await request(app).get('/status');
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('online');
        });

        test('GET /api/noticias deve listar e paginar', async () => {
            const res = await request(app).get('/api/noticias?page=1');
            expect(res.statusCode).toBe(200);
            expect(res.body.noticias).toBeDefined();
        });

        test('POST /api/noticias/:id/voto deve votar up/down e falhar em 404', async () => {
            const n = await Noticia.create({ titulo: "V", conteudo: "C" });
            const resUp = await request(app).post(`/api/noticias/${n.id}/voto`).send({ tipo: 'up' });
            const resDown = await request(app).post(`/api/noticias/${n.id}/voto`).send({ tipo: 'down' });
            const res404 = await request(app).post('/api/noticias/999/voto').send({ tipo: 'up' });

            expect(resUp.body.up).toBe(1);
            expect(resDown.body.down).toBe(1);
            expect(res404.statusCode).toBe(404);
        });

        test('POST /api/upload - Fluxo Total (Sucesso, Filtro, Imagem, Erro)', async () => {
            // Sucesso com Imagem e Filtro
            const res = await request(app)
                .post('/api/upload')
                .set('x-api-key', API_KEY)
                .send({
                    titulo: "Censura porra",
                    conteudo: "Foda",
                    imagem: { nome: "t.png", base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==" }
                });
            expect(res.statusCode).toBe(200);

            const n = await Noticia.findByPk(res.body.id);
            expect(n.titulo).toBe("Censura p****");

            // Sem API Key
            const res403 = await request(app).post('/api/upload').send({});
            expect(res403.statusCode).toBe(403);

            // Arquivo Inválido (Não imagem)
            const res400 = await request(app)
                .post('/api/upload')
                .set('x-api-key', API_KEY)
                .send({
                    imagem: { nome: "t.txt", base64: "SGVsbG8=" }
                });
            expect(res400.statusCode).toBe(400);

            // Sem Imagem
            const resNoImg = await request(app)
                .post('/api/upload')
                .set('x-api-key', API_KEY)
                .send({ titulo: "OK" });
            expect(resNoImg.statusCode).toBe(200);
        });

        test('Listagens de Terceiros: Avisos, Vagas, Acervo', async () => {
            await Aviso.create({ titulo: "A" });
            await Vaga.create({ cargo: "V" });
            await Acervo.create({ titulo: "Ac" });

            const resA = await request(app).get('/api/avisos');
            const resV = await request(app).get('/api/vagas');
            const resAc = await request(app).get('/api/acervo');

            expect(resA.body.length).toBeGreaterThan(0);
            expect(resV.body.length).toBeGreaterThan(0);
            expect(resAc.body.length).toBeGreaterThan(0);
        });

        test('Modo Standalone (SERVE_STATIC)', async () => {
            process.env.SERVE_STATIC = 'true';
            const res = await request(app).get('/status');
            expect(res.body.modo).toBe('standalone');
        });
    });

    // 4. EDGE CASES: Erros e Catch Blocks
    describe('Coverage Edge Cases', () => {
        test('Voto deve lidar com erro de banco', async () => {
            const spy = jest.spyOn(Noticia, 'findByPk').mockImplementation(() => { throw new Error("Voto Fail"); });
            const res = await request(app).post('/api/noticias/1/voto').send({ tipo: 'up' });
            expect(res.statusCode).toBe(500);
            spy.mockRestore();
        });
        test('GET /api/noticias deve lidar com erros de banco (Simulado)', async () => {
            // Mock temporário para forçar erro
            const spy = jest.spyOn(Noticia, 'findAndCountAll').mockImplementation(() => { throw new Error("DB Fail"); });
            const res = await request(app).get('/api/noticias');
            expect(res.statusCode).toBe(500);
            spy.mockRestore();
        });

        test('POST /api/upload deve lidar com erro de banco (Simulado)', async () => {
            const spy = jest.spyOn(Noticia, 'create').mockImplementation(() => { throw new Error("Create Fail"); });
            const res = await request(app)
                .post('/api/upload')
                .set('x-api-key', API_KEY)
                .send({ titulo: "T" });
            expect(res.statusCode).toBe(500);
            spy.mockRestore();
        });
        test('POST /api/upload deve lidar com erro de escrita de arquivo (Simulado)', async () => {
            const spy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => { throw new Error("Disk Full"); });
            const res = await request(app)
                .post('/api/upload')
                .set('x-api-key', API_KEY)
                .send({
                    titulo: "T",
                    imagem: { nome: "t.jpg", base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==" }
                });
            expect(res.statusCode).toBe(500);
            spy.mockRestore();
        });
    });
});
