import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/noticias?page=${pagina}`).then(res => {
      setNoticias(res.data.noticias || []);
      setTotalPaginas(res.data.total_paginas || 1);
    });
  }, [pagina]);

  const votar = async (id, tipo) => {
    if (localStorage.getItem(`votou-${id}`)) return alert("Já votou nesta notícia!");
    try {
      const res = await axios.post(`http://localhost:3000/api/noticias/${id}/voto`, { tipo });
      setNoticias(noticias.map(n => n.id === id ? { ...n, upvotes: res.data.up, downvotes: res.data.down } : n));
      localStorage.setItem(`votou-${id}`, true);
    } catch (error) {
      console.error("Erro ao votar", error);
    }
  };

  const processarTexto = (n) => {
    let img = n.imagem_capa ? `<figure class="foto-jornal"><img src="http://localhost:3000${n.imagem_capa}"/></figure>` : '';
    let txt = (n.conteudo || "").replace(/\n/g, '<br>');
    return { __html: txt.includes('[FOTO]') ? txt.replace('[FOTO]', img) : img + `<div class="texto-padrao">${txt}</div>` };
  };

  return (
    <section className="modulo ativo" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Feed de Notícias</h1>
      <div className="feed-container">
        {noticias.length === 0 ? <p style={{ textAlign: 'center' }}>Nenhuma notícia encontrada.</p> : noticias.map(n => (
          <article key={n.id} className="news-paper-card">
            <header>
              <span className="news-date">{new Date(n.data_postagem).toLocaleDateString('pt-PT')}</span>
              <h2 className="news-headline">{n.titulo}</h2>
            </header>
            <div className="news-body" dangerouslySetInnerHTML={processarTexto(n)} />
            <footer className="news-footer">
              <div className="vote-system">
                <button onClick={() => votar(n.id, 'up')} className="btn-vote up">👍 <span>{n.upvotes}</span></button>
                <button onClick={() => votar(n.id, 'down')} className="btn-vote down">👎 <span>{n.downvotes}</span></button>
              </div>
            </footer>
          </article>
        ))}
      </div>
      <div className="pagination-controls" style={{ marginTop: 'auto' }}>
        <button className="pag-btn" onClick={() => setPagina(p => p - 1)} disabled={pagina <= 1}>Anterior</button>
        <span>Página {pagina} de {totalPaginas}</span>
        <button className="pag-btn" onClick={() => setPagina(p => p + 1)} disabled={pagina >= totalPaginas}>Próxima</button>
      </div>
    </section>
  );
}