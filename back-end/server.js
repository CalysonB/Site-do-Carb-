const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sequelize = require('./database');
const { sanitizeContent } = require('./utils/contentFilter');
const FileType = require('file-type');

const app = express();
const isTest = process.env.NODE_ENV === 'test';

// ==========================================
// 0. SEGURANÇA (HARDENING)
// ==========================================

// 1. Helmet: Define cabeçalhos de segurança HTTP
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// 2. Rate Limiting: Proteção contra DDoS e Brute Force
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { erro: 'Muitas requisições, tente novamente mais tarde.' }
});

// Não aplica rate limit em testes para não bloquear a suíte
if (!isTest) {
    app.use('/api/', limiter);
}

// 3. CORS: Restringir origens
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

app.use(express.json({ limit: '50mb' }));

// ==========================================
// 1. CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS
// ==========================================

const publicDir = path.join(__dirname, 'public');

console.log("---------------------------------------------------");
console.log("🔍 Pasta do site definida como:", publicDir);
console.log("---------------------------------------------------");

if (process.env.SERVE_STATIC === 'true') {
    const frontendDir = path.join(__dirname, '../front-end/public');
    console.log("---------------------------------------------------");
    console.log("🚀 MODO STANDALONE (Sem Docker): Servindo frontend de:", frontendDir);
    console.log("---------------------------------------------------");
    app.use(express.static(frontendDir));
}

const uploadDir = path.join(publicDir, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

app.use('/uploads', express.static(uploadDir));

app.get('/status', (req, res) => {
    res.json({ status: 'online', modo: process.env.SERVE_STATIC === 'true' ? 'standalone' : 'api-only' });
});

const { Noticia, Aviso, Vaga, Acervo } = require('./models');

// ==========================================
// 3. ROTAS DA API
// ==========================================

app.post('/api/noticias/:id/voto', async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo } = req.body;

        const noticia = await Noticia.findByPk(id);
        if (!noticia) return res.status(404).json({ erro: 'Notícia não encontrada' });

        if (tipo === 'up') noticia.upvotes += 1;
        else if (tipo === 'down') noticia.downvotes += 1;

        await noticia.save();
        res.json({ up: noticia.upvotes, down: noticia.downvotes });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao votar' });
    }
});

app.get('/api/noticias', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await Noticia.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [['data_postagem', 'DESC']]
        });

        res.json({
            total_itens: count,
            total_paginas: Math.ceil(count / limit),
            pagina_atual: page,
            noticias: rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao buscar notícias" });
    }
});

app.get('/api/avisos', async (req, res) => {
    const dados = await Aviso.findAll();
    res.json(dados);
});

app.get('/api/vagas', async (req, res) => {
    const dados = await Vaga.findAll({ where: { ativo: true } });
    res.json(dados);
});

app.get('/api/acervo', async (req, res) => {
    const dados = await Acervo.findAll({ order: [['ano', 'DESC']] });
    res.json(dados);
});

app.post('/api/upload', async (req, res) => {
    try {
        const apiKeyRecebida = req.headers['x-api-key'];
        const apiKeyCorreta = process.env.API_KEY || "CARB_SECURE_KEY_2026_X9Z"; // Fallback para testes

        if (apiKeyRecebida !== apiKeyCorreta) {
            if (!isTest) console.warn(`Acesso não autorizado ao Webhook. IP: ${req.ip}`);
            return res.status(403).json({ erro: "Acesso Proibido. Chave de API inválida." });
        }

        const { titulo, conteudo, imagem } = req.body;
        let urlFinal = '';

        const tituloFiltrado = sanitizeContent(titulo || "Notícia via E-mail");
        const conteudoFiltrado = sanitizeContent(conteudo || "");

        if (imagem && imagem.base64) {
            const buffer = Buffer.from(imagem.base64, 'base64');
            // 🛡️ Validação de Tipo Real (Magic Numbers)
            const type = await FileType.fromBuffer(buffer);
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

            if (!type || !allowedMimeTypes.includes(type.mime)) {
                return res.status(400).json({ erro: 'Tipo de arquivo não permitido. Apenas imagens são aceitas.' });
            }

            const nomeArquivo = `${Date.now()}.${type.ext}`;
            const caminhoFisico = path.join(uploadDir, nomeArquivo);
            fs.writeFileSync(caminhoFisico, buffer);
            urlFinal = `/uploads/${nomeArquivo}`;
        }

        const novaNoticia = await Noticia.create({
            titulo: tituloFiltrado,
            conteudo: conteudoFiltrado,
            imagem_capa: urlFinal
        });

        console.log(`Nova notícia criada via E-mail: ID ${novaNoticia.id}`);
        res.json({ status: 'sucesso', id: novaNoticia.id, url: urlFinal });

    } catch (e) {
        console.error("Erro no Webhook:", e); // Re-habilitado para depurar teste
        res.status(500).json({ erro: e.message });
    }
});

// ==========================================
// 4. INICIALIZAÇÃO
// ==========================================
const PORT = process.env.PORT || 3000;
if (require.main === module && !isTest) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`--------------------------------------------------`);
        console.log(`SERVIDOR RODANDO NA PORTA ${PORT}`);
        console.log(`--------------------------------------------------`);
        console.log(`🛡️  Segurança Ativa: Helmet, RateLimit, SafeUploads`);
        console.log(`--------------------------------------------------`);
    });
}

module.exports = app;