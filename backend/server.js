const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sequelize = require('./database');
const { Noticia, Aviso, Vaga, Acervo } = require('./models');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors()); // Essencial para o React conseguir aceder à API

// Pasta de uploads (para as imagens das notícias)
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

// Rotas da API
// No server.js (Backend)
const { Op } = require('sequelize');

app.get('/api/noticias', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const busca = req.query.q || ''; // Captura a busca
    const limit = 20;

    try {
        const { count, rows } = await Noticia.findAndCountAll({
            where: {
                titulo: { [Op.like]: `%${busca}%` } // Pesquisa no título
            },
            limit: limit,
            offset: (page - 1) * limit,
            order: [['data_postagem', 'DESC']]
        });
        res.json({ total_paginas: Math.ceil(count / limit), noticias: rows });
    } catch (error) { res.status(500).json({ erro: "Erro ao buscar" }); }
});

app.post('/api/noticias/:id/voto', async (req, res) => {
    try {
        const noticia = await Noticia.findByPk(req.params.id);
        if (!noticia) return res.status(404).json({ erro: 'Não encontrada' });
        if (req.body.tipo === 'up') noticia.upvotes += 1;
        else if (req.body.tipo === 'down') noticia.downvotes += 1;
        await noticia.save();
        res.json({ up: noticia.upvotes, down: noticia.downvotes });
    } catch (error) { res.status(500).json({ erro: 'Erro ao votar' }); }
});

app.get('/api/vagas', async (req, res) => {
    const dados = await Vaga.findAll({ where: { ativo: true } });
    res.json(dados);
});

app.get('/api/acervo', async (req, res) => {
    const dados = await Acervo.findAll({ order: [['ano', 'DESC']] });
    res.json(dados);
});

app.listen(3000, '0.0.0.0', () => console.log('Servidor Backend a correr na porta 3000'));

// ==========================================
// ROTA WEBHOOK: RECEBE NOTÍCIAS DO GMAIL
// ==========================================
app.post('/api/upload', async (req, res) => {
    // 1. Verificação de Segurança (API Key)
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== "CARB_SECURE_KEY_2026_X9Z") {
        console.warn("Tentativa de acesso bloqueada (API Key inválida).");
        return res.status(403).json({ erro: "Acesso negado." });
    }

    try {
        const { titulo, conteudo, imagem } = req.body; 
        let urlFinal = '';

        // 2. Processa a imagem de capa (se houver)
        if (imagem && imagem.base64) {
            const nomeLimpo = imagem.nome ? imagem.nome.replace(/[^a-zA-Z0-9.]/g, "_") : "imagem_email.jpg";
            const nomeArquivo = `${Date.now()}-${nomeLimpo}`;
            
            // Grava o ficheiro na pasta /public/uploads
            const caminhoFisico = path.join(__dirname, 'public', 'uploads', nomeArquivo);
            const buffer = Buffer.from(imagem.base64, 'base64');
            fs.writeFileSync(caminhoFisico, buffer);

            urlFinal = `/uploads/${nomeArquivo}`;
        }

        // 3. Salva a notícia na Base de Dados
        const novaNoticia = await Noticia.create({ 
            titulo: titulo || "Notícia via E-mail", 
            conteudo: conteudo || "", 
            imagem_capa: urlFinal 
        });

        console.log(`✅ Nova notícia via e-mail publicada: ${titulo}`);
        res.status(200).json({ status: 'sucesso', id: novaNoticia.id, url: urlFinal });

    } catch (e) {
        console.error("❌ Erro ao processar webhook do Gmail:", e);
        res.status(500).json({ erro: e.message });
    }
});