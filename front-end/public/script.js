// CONFIGURAÇÃO UNIVERSAL (Funciona no PC e no Celular)
// Ao usar '/api', o navegador procura no mesmo endereço que abriu o site
const API_URL = '/api';

// 🛡️ SEGURANÇA: Importando DOMPurify via ESM (CDN)
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/+esm';

let paginaAtual = 1;

// --- 1. NAVEGAÇÃO ENTRE MÓDULOS ---
function mostrarModulo(idModulo, btnClicado) {
    // Esconde todos
    document.querySelectorAll('.modulo').forEach(el => el.classList.remove('ativo'));
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));

    // Mostra o atual
    const moduloAlvo = document.getElementById(idModulo);
    if (moduloAlvo) moduloAlvo.classList.add('ativo');

    if (btnClicado) btnClicado.classList.add('active');

    // Carrega dados específicos
    if (idModulo === 'modulo-1') carregarNoticias();
    if (idModulo === 'modulo-3') carregarVagas();
}

// --- 2. PAGINAÇÃO ---
function mudarPagina(direcao) {
    const novaPagina = paginaAtual + direcao;
    if (novaPagina < 1) return;

    paginaAtual = novaPagina;
    carregarNoticias();
}

// --- 3. CARREGAR NOTÍCIAS (Lógica Principal) ---
async function carregarNoticias() {
    const container = document.getElementById('container-noticias');
    const indicador = document.getElementById('indicador-pagina');
    const btnAnt = document.getElementById('btn-ant');
    const btnProx = document.getElementById('btn-prox');

    if (!container) return; // Segurança

    try {
        console.log(`📡 Buscando notícias da página ${paginaAtual}...`);

        const response = await fetch(`${API_URL}/noticias?page=${paginaAtual}`);

        if (!response.ok) throw new Error(`Erro do Servidor: ${response.status}`);

        const dados = await response.json();

        // Trata os dados (se vier lista ou objeto paginado)
        let listaNoticias = [];
        let totalPaginas = 1;

        if (Array.isArray(dados)) {
            listaNoticias = dados;
        } else if (dados.noticias) {
            listaNoticias = dados.noticias;
            totalPaginas = dados.total_paginas || 1;
        }

        // Atualiza a tela
        container.innerHTML = '';

        // Atualiza botões de paginação
        if (indicador) indicador.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
        if (btnAnt) btnAnt.disabled = paginaAtual <= 1;
        if (btnProx) btnProx.disabled = paginaAtual >= totalPaginas;

        if (listaNoticias.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding:30px; color:#666;">Nenhuma notícia encontrada.</p>';
            return;
        }

        // OTIMIZAÇÃO DE PERFORMANCE (Batch Rendering)
        // Evita "Layout Thrashing" criando todo o HTML na memória antes de jogar no DOM
        const htmlFinal = listaNoticias.map(noticia => criarHtmlJornal(noticia)).join('');

        container.innerHTML = htmlFinal;

        // Volta pro topo da leitura
        const contentDiv = document.querySelector('.content');
        if (contentDiv) contentDiv.scrollTop = 0;

    } catch (error) {
        console.error("❌ ERRO NO FRONTEND:", error);
        container.innerHTML = `
            <div style="text-align:center; color:#c0392b; padding:20px;">
                <h3>Ocorreu um erro ao carregar as notícias.</h3>
                <p>${error.message}</p>
                <button onclick="carregarNoticias()" style="margin-top:10px; padding:5px 10px;">Tentar Novamente</button>
            </div>
        `;
    }
}

// --- 4. RENDERIZADOR DE HTML (Estilo Jornal) ---
function criarHtmlJornal(noticia) {
    let tagImagem = '';

    if (noticia.imagem_capa) {
        // Se a imagem for um link externo (http) ou interno (/uploads)
        const src = noticia.imagem_capa;
        tagImagem = `
            <figure class="foto-jornal">
                <img src="${src}" alt="Imagem da Notícia" onerror="this.style.display='none'">
                <figcaption>Registro Oficial CARB</figcaption>
            </figure>
        `;
    }

    // 🛡️ SEGURANÇA ANT-XSS: Sanitização de Inputs
    // Remove qualquer script malicioso que possa vir do banco
    let conteudoSeguro = DOMPurify.sanitize(noticia.conteudo || "");

    // Processa quebras de linha APÓS sanitizar
    conteudoSeguro = conteudoSeguro.replace(/\n/g, '<br>');

    if (conteudoSeguro.includes('[FOTO]')) {
        conteudoSeguro = conteudoSeguro.replace('[FOTO]', tagImagem);
    } else {
        conteudoSeguro = tagImagem + `<div class="texto-padrao">${conteudoSeguro}</div>`;
    }

    return `
        <article class="news-paper-card">
            <header>
                <span class="news-date">
                    ${new Date(noticia.data_postagem).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
                <h2 class="news-headline">${noticia.titulo}</h2>
            </header>
            
            <div class="news-body">
                ${conteudoSeguro}
            </div>

            <footer class="news-footer">
                <div class="vote-system">
                    <button onclick="votar(${noticia.id}, 'up')" class="btn-vote up">
                        👍 <span id="up-${noticia.id}">${noticia.upvotes || 0}</span>
                    </button>
                    <button onclick="votar(${noticia.id}, 'down')" class="btn-vote down">
                        👎 <span id="down-${noticia.id}">${noticia.downvotes || 0}</span>
                    </button>
                </div>
            </footer>
        </article>
        <hr class="news-divider">
    `;
}

// --- 5. SISTEMA DE VOTOS ---
async function votar(id, tipo) {
    if (localStorage.getItem(`votou-${id}`)) {
        alert("Você já votou nesta notícia!");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/noticias/${id}/voto`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tipo })
        });

        if (res.ok) {
            const dados = await res.json();
            document.getElementById(`up-${id}`).innerText = dados.up;
            document.getElementById(`down-${id}`).innerText = dados.down;
            localStorage.setItem(`votou-${id}`, true);
        }
    } catch (error) {
        console.error("Erro ao votar:", error);
    }
}

// --- 6. CARREGAR VAGAS (Módulo 3) ---
async function carregarVagas() {
    const container = document.getElementById('container-vagas');
    if (!container) return;

    try {
        container.innerHTML = '<p>Carregando vagas...</p>';
        const response = await fetch(`${API_URL}/vagas`);
        const vagas = await response.json();

        container.innerHTML = '';

        if (vagas.length === 0) {
            container.innerHTML = '<p>Nenhuma vaga disponível.</p>';
            return;
        }

        vagas.forEach(vaga => {
            const card = document.createElement('div');
            card.className = 'tweet-card';
            card.innerHTML = `
                <div class="tweet-header">
                    <div class="tweet-info">
                        <h3 style="font-size:1.1rem; color:#2c3e50; font-weight:bold">${vaga.cargo}</h3>
                        <span class="tweet-date">${vaga.escritorio}</span>
                    </div>
                </div>
                <div class="tweet-text news-desc">
                    ${vaga.detalhes ? JSON.stringify(vaga.detalhes).replace(/["{}]/g, "") : 'Verifique requisitos.'}
                </div>
            `;
            container.appendChild(card);
        });
    } catch (e) {
        container.innerHTML = '<p>Erro ao carregar vagas.</p>';
    }
}

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    carregarNoticias();
});

// LOGICA DO MENU MOBILE (Javascript do CSS que fizemos)
const btnMenu = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

if (btnMenu) {
    btnMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('ativo-mobile');
    });
}

// Fecha sidebar ao clicar fora ou em um link
document.addEventListener('click', (e) => {
    if (sidebar && sidebar.classList.contains('ativo-mobile') && !sidebar.contains(e.target) && e.target !== btnMenu) {
        sidebar.classList.remove('ativo-mobile');
    }
});

const botoesSidebar = document.querySelectorAll('.menu-btn');
botoesSidebar.forEach(btn => {
    btn.addEventListener('click', () => {
        if (window.innerWidth <= 768) sidebar.classList.remove('ativo-mobile');
    });
});

// 🌍 TORNANDO FUNÇÕES GLOBAIS (Necessário para onclick no HTML com type="module")
// Como agora usamos "module" para importar o DOMPurify, as funções ficaram "privadas".
// Isso expõe elas de volta para o HTML (onclick).
window.mostrarModulo = mostrarModulo;
window.mudarPagina = mudarPagina;
window.votar = votar;