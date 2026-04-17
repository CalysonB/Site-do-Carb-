import { useState } from 'react';

export default function PainelDireito() {
  const [busca, setBusca] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    alert('A busca por "' + busca + '" será conectada ao backend em breve!');
  };

  return (
    <div style={{ position: 'sticky', top: '20px' }}>
      {/* Barra de Pesquisa */}
      <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Buscar no CARB..." 
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="search-input"
        />
      </form>

      {/* Card do Agente de Matrícula */}
      <div className="whatsapp-card">
        <h3 style={{ marginBottom: '10px', color: '#1da1f2' }}>Agente de Matrícula</h3>
        <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '15px' }}>
          Dúvidas sobre disciplinas ou processos? Fale diretamente connosco.
        </p>
        <a 
          href="https://wa.me/5571999999999?text=Olá! Preciso de ajuda com a matrícula no CARB." 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-whatsapp"
        >
          💬 Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}