const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { DataTypes } = require('sequelize');
const sequelize = require('./database'); // Seu arquivo de conexão funcionando

const app = express();
app.use(express.json({ limit: '50mb' })); // Limite alto para upload de imagens
app.use(cors());

// ==========================================
// 1. CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS (SITE + IMAGENS)
// ==========================================

// Define a pasta onde está o site (api/public)
const publicDir = path.join(__dirname, 'public');

// IMPRIME NO TERMINAL ONDE O SERVIDOR ESTÁ OLHANDO (Para Debug)
console.log("---------------------------------------------------");
console.log("🔍 Pasta do site definida como:", publicDir);
console.log("---------------------------------------------------");

// 1. Manda o servidor entregar TUDO que estiver na pasta public (HTML, CSS, JS, Uploads)
app.use(express.static(publicDir));

// 2. Garante a pasta de uploads
const uploadDir = path.join(publicDir, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// 3. Rota de emergência: Se acessar a raiz '/', força a entrega do index.html
app.get('/', (req, res) => {
    const arquivoIndex = path.join(publicDir, 'index.html');
    if (fs.existsSync(arquivoIndex)) {
        res.sendFile(arquivoIndex);
    } else {
        res.status(404).send(`<h1>Erro: index.html não encontrado!</h1><p>O servidor procurou em: ${publicDir}</p>`);
    }
});

// ==========================================
// 2. DEFINIÇÃO DAS TABELAS (MODELOS)
// ==========================================

// Módulo 1: Notícias (Com Votos)
const Noticia = sequelize.define('Noticia', {
    titulo: { type: DataTypes.STRING, allowNull: false },
    conteudo: { type: DataTypes.TEXT },
    imagem_capa: { type: DataTypes.STRING },
    data_postagem: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    upvotes: { type: DataTypes.INTEGER, defaultValue: 0 },
    downvotes: { type: DataTypes.INTEGER, defaultValue: 0 }
});

// Módulo 2: Agente de Matrícula (Avisos)
const Aviso = sequelize.define('Aviso', {
    titulo: { type: DataTypes.STRING },
    mensagem: { type: DataTypes.TEXT },
    urgente: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// Módulo 3: Vagas de Emprego
const Vaga = sequelize.define('Vaga', {
    cargo: { type: DataTypes.STRING },
    escritorio: { type: DataTypes.STRING },
    detalhes: { type: DataTypes.JSON },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// Módulo 4: Acervo Carb
const Acervo = sequelize.define('Acervo', {
    titulo: { type: DataTypes.STRING },
    categoria: { type: DataTypes.STRING },
    arquivo_url: { type: DataTypes.STRING },
    ano: { type: DataTypes.INTEGER }
});

// Sincroniza o banco
sequelize.sync().then(() => {
    console.log("✅ Banco de Dados Sincronizado!");
});

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

// Rota de Upload (Gmail)
app.post('/api/upload', async (req, res) => {
    try {
        const { titulo, conteudo, imagem } = req.body; 
        let urlFinal = '';

        if (imagem && imagem.base64) {
            const nomeLimpo = imagem.nome ? imagem.nome.replace(/[^a-zA-Z0-9.]/g, "_") : "imagem_email.jpg";
            const nomeArquivo = `${Date.now()}-${nomeLimpo}`;
            const caminhoFisico = path.join(uploadDir, nomeArquivo);

            const buffer = Buffer.from(imagem.base64, 'base64');
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
});