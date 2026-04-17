import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Acervo() {
  const [acervo, setAcervo] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/acervo').then(res => setAcervo(res.data));
  }, []);

  return (
    <section className="modulo ativo">
      <h1>Acervo CARB</h1>
      <hr style={{ margin: '20px 0' }} /><br />
      <div>
        {acervo.length === 0 ? <p>Nenhum documento encontrado.</p> : (
          <ul>
            {acervo.map(item => (
              <li key={item.id} style={{ marginBottom: '10px' }}>
                <strong>{item.ano} - {item.categoria}:</strong> {item.titulo} 
                {item.arquivo_url && <a href={`http://localhost:3000${item.arquivo_url}`} target="_blank" rel="noreferrer" style={{ marginLeft: '10px', color: '#e74c3c' }}>[Baixar PDF]</a>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}