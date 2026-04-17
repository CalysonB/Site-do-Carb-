import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Vagas() {
  const [vagas, setVagas] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/vagas').then(res => setVagas(res.data));
  }, []);

  return (
    <section className="modulo ativo">
      <h1>Vagas de Emprego</h1>
      <hr style={{ margin: '20px 0' }} /><br />
      <div className="news-grid">
        {vagas.length === 0 ? <p>Nenhuma vaga disponível no momento.</p> : vagas.map(vaga => (
          <div key={vaga.id} className="tweet-card">
            <div className="tweet-header">
              <div className="tweet-info">
                <h3 style={{ fontSize: '1.1rem', color: '#2c3e50', fontWeight: 'bold' }}>{vaga.cargo}</h3>
                <span className="tweet-date">{vaga.escritorio}</span>
              </div>
            </div>
            <div className="tweet-text news-desc">
              {vaga.detalhes ? JSON.stringify(vaga.detalhes).replace(/["{}]/g, "") : 'Verifique os requisitos.'}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}