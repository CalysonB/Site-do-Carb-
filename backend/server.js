import app from './src/app.js';
import { sequelize } from './models.js';

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    console.log("✅ Tabelas da Base de Dados sincronizadas com sucesso!");
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}).catch(err => {
    console.error("❌ Falha ao iniciar o servidor (DB Error):", err);
});