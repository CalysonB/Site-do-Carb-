const mariadb = require('mariadb');

async function criarBanco() {
    try {
        // 1. Liga ao servidor MariaDB (sem entrar em nenhuma base de dados específica)
        const conexao = await mariadb.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'CARB26' // Mude aqui se a sua senha do HeidiSQL for diferente
        });

        // 2. Executa o comando SQL para criar a base de dados
        await conexao.query("CREATE DATABASE IF NOT EXISTS noticias;");
        console.log("✅ Base de dados 'noticias' criada com sucesso direto pelo Node!");

        // 3. Fecha a ligação
        await conexao.end();
        
    } catch (erro) {
        console.error("❌ Ocorreu um erro:", erro.message);
    }
}

criarBanco();