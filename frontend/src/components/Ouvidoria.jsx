import { useState } from 'react';
import axios from 'axios';

export default function Ouvidoria() {
  const [mensagem, setMensagem] = useState('');
  const [status, setStatus] = useState('');

  const enviarSugestao = async (e) => {
    e.preventDefault();
    if (!mensagem.trim()) return;
    
    try {
      await axios.post('http://localhost:3000/api/ouvidoria', { mensagem });
      setStatus('✅ A sua mensagem foi enviada anonimamente para a direção!');
      setMensagem('');
      setTimeout(() => setStatus(''), 5000);
    } catch (error) {
      setStatus('❌ Erro ao enviar mensagem. Tente novamente.');
    }
  };

  return (
    <section className="modulo ativo" style={{ padding: '20px' }}>
      <h1 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>Ouvidoria CARB</h1>
      <p style={{ marginTop: '20px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Este é um canal seguro e 100% anónimo. Envie sugestões, críticas ou denúncias. 
        Apenas a administração do centro académico terá acesso.
      </p>

      <form onSubmit={enviarSugestao} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <textarea 
          rows="6"
          placeholder="O que está a acontecer?"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          style={{
            width: '100%', padding: '15px', borderRadius: '12px', 
            backgroundColor: 'var(--bg-color)', color: 'white',
            border: '1px solid var(--border-color)', fontSize: '1rem',
            resize: 'none', outline: 'none'
          }}
        />
        <button 
          type="submit" 
          style={{
            alignSelf: 'flex-end', padding: '10px 25px', borderRadius: '9999px',
            backgroundColor: 'var(--accent-color)', color: 'white',
            border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem'
          }}
        >
          Enviar Anonimamente
        </button>
      </form>
      {status && <p style={{ marginTop: '20px', fontWeight: 'bold', color: status.includes('✅') ? '#00ba7c' : 'var(--error-color)' }}>{status}</p>}
    </section>
  );
}