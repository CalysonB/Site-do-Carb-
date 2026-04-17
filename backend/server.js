const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Protege contra vulnerabilidades de HTTP
const rateLimit = require('express-rate-limit'); // Evita ataques de força bruta e spam de votos
const path = require('path');
const fs = require('fs');
const crypto = require('crypto'); // Para gerar nomes de ficheiros seguros
require('dotenv').config(); // Carrega variáveis de ambiente
const jwt = require('jsonwebtoken'); // Adicione isto no topo com os outros requires
const { Sugestao } = require('./models'); // Garanta que a Sugestao é importada
const app = express();

// 1. Camada de Segurança HTTP
app.use(helmet()); 
app.use(express.json({ limit: '10mb' }));

// 2. Restrição de CORS (Compliance de Origem)
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Apenas seu frontend pode acessar
    optionsSuccessStatus: 200
}));

// 3. Limitador de Requisições (Prevenção contra Spam de Votos/Sugestões)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // Limite cada IP a 100 requisições por janela
});

// ==========================================
// MIDDLEWARE DE SEGURANÇA (Porteiro do Admin)
// ==========================================
const verificarAdmin = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ erro: 'Acesso negado: Token não fornecido.' });
    
    // O formato do token chega como "Bearer eyJhbGci..."
    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ erro: 'Acesso negado: Token inválido ou expirado.' });
        next(); // Deixa o admin passar
    });
};

// ==========================================
// ROTAS DE ADMINISTRAÇÃO
// ==========================================
// 1. Login do Admin
app.post('/api/admin/login', (req, res) => {
    const { usuario, senha } = req.body;
    if (usuario === process.env.ADMIN_USER && senha === process.env.ADMIN_PASS) {
        // Gera um token válido por 2 horas
        const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ token });
    } else {
        res.status(401).json({ erro: 'Credenciais inválidas' });
    }
});

// 2. Deletar Notícia (Protegida)
app.delete('/api/noticias/:id', verificarAdmin, async (req, res) => {
    try {
        await Noticia.destroy({ where: { id: req.params.id } });
        res.json({ mensagem: 'Notícia removida com sucesso.' });
    } catch (e) { res.status(500).json({ erro: e.message }); }
});

// ==========================================
// ROTAS DA OUVIDORIA
// ==========================================
// 1. Aluno envia sugestão (Pública)
app.post('/api/ouvidoria', async (req, res) => {
    try {
        if (!req.body.mensagem) return res.status(400).json({ erro: 'A mensagem está vazia.' });
        await Sugestao.create({ mensagem: req.body.mensagem });
        res.json({ status: 'sucesso' });
    } catch (e) { res.status(500).json({ erro: e.message }); }
});

// 2. Admin lê sugestões (Protegida)
app.get('/api/ouvidoria', verificarAdmin, async (req, res) => {
    try {
        const sugestoes = await Sugestao.findAll({ order: [['createdAt', 'DESC']] });
        res.json(sugestoes);
    } catch (e) { res.status(500).json({ erro: e.message }); }
});

app.use('/api/', limiter);

// 4. Webhook Seguro para o Gmail
app.post('/api/upload', async (req, res) => {
    // API KEY deve estar num ficheiro .env para não vazar no GitHub
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.API_KEY_CARB) {
        return res.status(403).json({ erro: "Unauthorized" });
    }

    try {
        const { titulo, conteudo, imagem } = req.body;
        let urlFinal = '';

        if (imagem && imagem.base64) {
            // SEGURANÇA: Nunca confie no nome original do ficheiro
            const extensao = imagem.nome.split('.').pop().toLowerCase();
            if (!['jpg', 'jpeg', 'png'].includes(extensao)) throw new Error("Tipo Proibido");
            
            // Gera um nome aleatório (UUID) para evitar ataques de Path Traversal
            const nomeSeguro = `${crypto.randomUUID()}.${extensao}`;
            const caminho = path.join(__dirname, 'public', 'uploads', nomeSeguro);
            
            fs.writeFileSync(caminho, Buffer.from(imagem.base64, 'base64'));
            urlFinal = `/uploads/${nomeSeguro}`;
        }

        // ... lógica de salvamento na DB (Noticia.create) ...
        res.status(200).json({ status: 'ok' });
    } catch (e) {
        res.status(500).json({ erro: "Internal Security Error" });
    }
});