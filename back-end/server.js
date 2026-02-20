const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// const { fileTypeFromBuffer } = require('file-type'); // Removido: Usado via import() dinâmico
// const { DataTypes } = require('sequelize'); // Removido: Usado em models.js
const sequelize = require('./database'); // Seu arquivo de conexão funcionando

const app = express();

// ==========================================
// 0. SEGURANÇA (HARDENING)
// ==========================================

// 1. Helmet: Define cabeçalhos de segurança HTTP
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Permite carregar imagens em outros domínios se necessário
}));

// 2. Rate Limiting: Proteção contra DDoS e Brute Force
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limite de 100 requisições por IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { erro: 'Muitas requisições, tente novamente mais tarde.' }
});
app.use('/api/', limiter); // Aplica apenas nas rotas de API

// 3. CORS: Restringir origens (Ajuste conforme produção)
// Em produção, substitua '*' pelo domínio real
app.use(cors({
    origin: '*', // TODO: Mudar para domínio de produção
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' })); // Limite alto para upload de imagens

// ==========================================
// 1. CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS (SITE + IMAGENS)
// ==========================================

// Define a pasta onde está o site (api/public)
const publicDir = path.join(__dirname, 'public');

// IMPRIME NO TERMINAL ONDE O SERVIDOR ESTÁ OLHANDO (Para Debug)
console.log("---------------------------------------------------");
console.log("🔍 Pasta do site definida como:", publicDir);
console.log("---------------------------------------------------");

// 1. Configuração de Arquivos Estáticos
// Se a variável de ambiente SERVE_STATIC for 'true', o Node.js servirá o frontend (Modo sem Docker)
if (process.env.SERVE_STATIC === 'true') {
    const frontendDir = path.join(__dirname, '../front-end/public');
    console.log("---------------------------------------------------");
    console.log("🚀 MODO STANDALONE (Sem Docker): Servindo frontend de:", frontendDir);
    console.log("---------------------------------------------------");

    // Serve os arquivos do frontend (HTML, CSS, JS) na raiz
    app.use(express.static(frontendDir));
}

// 2. Garante a pasta de uploads e a serve SEMPRE (independente do modo)
const uploadDir = path.join(publicDir, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Mapeia a rota /uploads para a pasta física de uploads da API
app.use('/uploads', express.static(uploadDir));

// 3. Rota de checagem da API
app.get('/status', (req, res) => {
    res.json({ status: 'online', modo: process.env.SERVE_STATIC === 'true' ? 'standalone' : 'api-only' });
});

const { Noticia, Aviso, Vaga, Acervo } = require('./models');

// ==========================================
// 2. MODELOS IMPORTADOS (Refatorado)
// ==========================================
// Os modelos agora estão definidos em ./models.js para evitar duplicação e erros.

// ==========================================
// 3. ROTAS DA API
// ==========================================

// Rota de Votos
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

// Rota de Notícias (Paginação)
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

// Outras listagens
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

// Rota de Upload Segura (Gmail)
app.post('/api/upload', async (req, res) => {
    try {
        // 🔒 PROTEÇÃO: Verifica a API Key (Senha)
        const apiKeyRecebida = req.headers['x-api-key'];
        const apiKeyCorreta = process.env.API_KEY;

        if (!apiKeyCorreta) {
            console.error("ERRO CRÍTICO: API_KEY não definida no servidor (.env ou docker-compose)");
            return res.status(500).json({ erro: "Erro de configuração do servidor." });
        }

        if (apiKeyRecebida !== apiKeyCorreta) {
            console.warn(`Tentativa de acesso não autorizado ao Webhook. IP: ${req.ip}`);
            return res.status(403).json({ erro: "Acesso Proibido. Chave de API inválida." });
        }

        const { titulo, conteudo, imagem } = req.body;
        let urlFinal = '';

        if (imagem && imagem.base64) {
            // Decodifica base64 para buffer
            const buffer = Buffer.from(imagem.base64, 'base64');

            // 🛡️ Validação de Tipo Real (Magic Numbers)
            const { fileTypeFromBuffer } = await import('file-type');
            const type = await fileTypeFromBuffer(buffer);
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

            if (!type || !allowedMimeTypes.includes(type.mime)) {
                console.warn(`Tentativa de upload de arquivo inválido: ${type ? type.mime : 'desconhecido'}`);
                return res.status(400).json({ erro: 'Tipo de arquivo não permitido. Apenas imagens são aceitas.' });
            }

            // Gera nome seguro: Timestamp + Extensão real detectada
            const nomeArquivo = `${Date.now()}.${type.ext}`;
            const caminhoFisico = path.join(uploadDir, nomeArquivo);

            fs.writeFileSync(caminhoFisico, buffer);

            urlFinal = `/uploads/${nomeArquivo}`;
        }

        const novaNoticia = await Noticia.create({
            titulo: titulo || "Notícia via E-mail",
            conteudo: conteudo || "",
            imagem_capa: urlFinal
        });

        console.log(`Nova notícia criada via E-mail: ID ${novaNoticia.id} - ${titulo}`);
        res.json({ status: 'sucesso', id: novaNoticia.id, url: urlFinal });

    } catch (e) {
        console.error("Erro no Webhook:", e);
        res.status(500).json({ erro: e.message });
    }
});

// ==========================================
// 4. INICIALIZAÇÃO
// ==========================================
const PORT = 3000;
// '0.0.0.0' permite acesso externo (celular na mesma rede)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`--------------------------------------------------`);
    console.log(`SERVIDOR RODANDO NA PORTA ${PORT}`);
    console.log(`Acesse no PC:      http://localhost:${PORT}`);
    console.log(`Acesse no Celular: http://SEU_IP_AQUI:${PORT}`);
    console.log(`--------------------------------------------------`);
    console.log(`🛡️  Segurança Ativa: Helmet, RateLimit, SafeUploads`);
    console.log(`--------------------------------------------------`);
});