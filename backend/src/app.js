import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { Sugestao, Noticia, Aviso, Vaga, Acervo } from '../models.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Segurança Básica e Headers
app.use(helmet({
    crossOriginResourcePolicy: false, // Permite que o frontend carregue imagens do backend
})); 
app.use(express.json({ limit: '10mb' }));

app.use(cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://127.0.0.1:5173'],
    optionsSuccessStatus: 200
}));

// Servir arquivos estáticos com segurança
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads'), {
    index: false,
    dotfiles: 'ignore'
}));

// 2. Proteção contra DoS e Brute Force
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { erro: "Muitas requisições. Tente novamente mais tarde." }
});
app.use('/api/', limiter);

// 3. Middlewares e Auxiliares
const verificarAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ erro: 'Acesso negado: Token não fornecido.' });
    
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ erro: 'Acesso negado: Token inválido ou expirado.' });
        req.user = decoded;
        next();
    });
};

const logAudit = (acao, recurso, id) => {
    console.log(`[AUDIT] ${new Date().toISOString()} - Ação: ${acao} | Recurso: ${recurso} | ID: ${id}`);
};

// 4. Rotas Públicas (Read Only)
app.get('/api/noticias', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const offset = (page - 1) * limit;
        const { count, rows } = await Noticia.findAndCountAll({ limit, offset, order: [['data_postagem', 'DESC']] });
        res.json({ noticias: rows, total_paginas: Math.ceil(count / limit) });
    } catch (e) { res.status(500).json({ erro: "Erro ao carregar notícias." }); }
});

app.get('/api/avisos', async (req, res) => {
    try {
        const avisos = await Aviso.findAll({ order: [['urgente', 'DESC'], ['createdAt', 'DESC']] });
        res.json(avisos);
    } catch (e) { res.status(500).json({ erro: "Erro ao carregar avisos." }); }
});

app.get('/api/vagas', async (req, res) => {
    try {
        const vagas = await Vaga.findAll({ where: { ativo: true }, order: [['createdAt', 'DESC']] });
        res.json(vagas);
    } catch (e) { res.status(500).json({ erro: "Erro ao carregar vagas." }); }
});

app.get('/api/acervo', async (req, res) => {
    try {
        const acervo = await Acervo.findAll({ order: [['ano', 'DESC'], ['titulo', 'ASC']] });
        res.json(acervo);
    } catch (e) { res.status(500).json({ erro: "Erro ao carregar acervo." }); }
});

app.post('/api/noticias/:id/voto', async (req, res) => {
    try {
        const noticia = await Noticia.findByPk(req.params.id);
        if (!noticia) return res.status(404).json({ erro: "Notícia não encontrada." });
        if (req.body.tipo === 'up') noticia.upvotes += 1;
        else if (req.body.tipo === 'down') noticia.downvotes += 1;
        await noticia.save();
        res.json({ up: noticia.upvotes, down: noticia.downvotes });
    } catch (e) { res.status(500).json({ erro: "Erro ao processar voto." }); }
});

app.post('/api/ouvidoria', async (req, res) => {
    try {
        const { mensagem } = req.body;
        if (!mensagem?.trim() || mensagem.length > 2000) return res.status(400).json({ erro: 'Mensagem inválida ou muito longa.' });
        await Sugestao.create({ mensagem });
        res.json({ status: 'sucesso' });
    } catch (e) { res.status(500).json({ erro: "Erro ao enviar sugestão." }); }
});

// 5. Rotas Administrativas (CUD)
app.post('/api/admin/login', (req, res) => {
    const { usuario, senha } = req.body;
    if (usuario === process.env.ADMIN_USER && senha === process.env.ADMIN_PASS) {
        const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ token });
    } else {
        res.status(401).json({ erro: 'Credenciais inválidas' });
    }
});

// News Management
app.post('/api/noticias', verificarAdmin, async (req, res) => {
    try {
        const { titulo, conteudo, imagem_capa } = req.body;
        if (!titulo || !conteudo || titulo.length > 200) return res.status(400).json({ erro: "Dados inválidos." });
        if (conteudo.length > 10000) return res.status(400).json({ erro: "Conteúdo muito longo." });
        
        const nova = await Noticia.create({ titulo, conteudo, imagem_capa });
        logAudit('CREATE', 'Noticia', nova.id);
        res.status(201).json(nova);
    } catch (e) { res.status(500).json({ erro: "Erro ao criar notícia." }); }
});

app.delete('/api/noticias/:id', verificarAdmin, async (req, res) => {
    try {
        await Noticia.destroy({ where: { id: req.params.id } });
        logAudit('DELETE', 'Noticia', req.params.id);
        res.json({ mensagem: 'Notícia removida.' });
    } catch (e) { res.status(500).json({ erro: "Erro ao remover notícia." }); }
});

// Ouvidoria
app.get('/api/ouvidoria', verificarAdmin, async (req, res) => {
    try {
        const sugestoes = await Sugestao.findAll({ order: [['createdAt', 'DESC']] });
        res.json(sugestoes);
    } catch (e) { res.status(500).json({ erro: "Erro ao listar sugestões." }); }
});

// Aviso Management
app.post('/api/avisos', verificarAdmin, async (req, res) => {
    try {
        const { titulo, mensagem, urgente, data_validade } = req.body;
        const novo = await Aviso.create({ titulo, mensagem, urgente, data_validade });
        logAudit('CREATE', 'Aviso', novo.id);
        res.status(201).json(novo);
    } catch (e) { res.status(500).json({ erro: "Erro ao criar aviso." }); }
});

app.delete('/api/avisos/:id', verificarAdmin, async (req, res) => {
    try {
        await Aviso.destroy({ where: { id: req.params.id } });
        logAudit('DELETE', 'Aviso', req.params.id);
        res.json({ mensagem: 'Aviso removido.' });
    } catch (e) { res.status(500).json({ erro: "Erro ao remover aviso." }); }
});

// Vaga Management
app.post('/api/vagas', verificarAdmin, async (req, res) => {
    try {
        const { cargo, escritorio, link_inscricao, detalhes } = req.body;
        const nova = await Vaga.create({ cargo, escritorio, link_inscricao, detalhes });
        logAudit('CREATE', 'Vaga', nova.id);
        res.status(201).json(nova);
    } catch (e) { res.status(500).json({ erro: "Erro ao criar vaga." }); }
});

app.delete('/api/vagas/:id', verificarAdmin, async (req, res) => {
    try {
        await Vaga.destroy({ where: { id: req.params.id } });
        logAudit('DELETE', 'Vaga', req.params.id);
        res.json({ mensagem: 'Vaga removida.' });
    } catch (e) { res.status(500).json({ erro: "Erro ao remover vaga." }); }
});

// Acervo Management
app.post('/api/acervo', verificarAdmin, async (req, res) => {
    try {
        const { titulo, categoria, arquivo_url, ano } = req.body;
        const novo = await Acervo.create({ titulo, categoria, arquivo_url, ano });
        logAudit('CREATE', 'Acervo', novo.id);
        res.status(201).json(novo);
    } catch (e) { res.status(500).json({ erro: "Erro ao criar item no acervo." }); }
});

app.delete('/api/acervo/:id', verificarAdmin, async (req, res) => {
    try {
        await Acervo.destroy({ where: { id: req.params.id } });
        logAudit('DELETE', 'Acervo', req.params.id);
        res.json({ mensagem: 'Item removido do acervo.' });
    } catch (e) { res.status(500).json({ erro: "Erro ao remover do acervo." }); }
});

// Secure Upload
app.post('/api/upload', verificarAdmin, async (req, res) => {
    try {
        const { imagem } = req.body;
        if (!imagem?.base64) return res.status(400).json({ erro: "Nenhuma imagem fornecida." });
        
        const extensao = imagem.nome.split('.').pop().toLowerCase();
        if (!['jpg', 'jpeg', 'png'].includes(extensao)) return res.status(400).json({ erro: "Tipo Proibido" });
        
        const nomeSeguro = `${crypto.randomUUID()}.${extensao}`;
        const caminho = path.join(__dirname, '..', 'public', 'uploads', nomeSeguro);
        
        fs.writeFileSync(caminho, Buffer.from(imagem.base64, 'base64'));
        logAudit('UPLOAD', 'Imagem', nomeSeguro);
        res.status(200).json({ status: 'ok', url: `/uploads/${nomeSeguro}` });
    } catch (e) { res.status(500).json({ erro: "Erro no upload." }); }
});

export default app;
