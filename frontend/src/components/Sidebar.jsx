export default function Sidebar({ moduloAtivo, setModuloAtivo }) {
  return (
    <nav className="sidebar">
      <h2>CARB Jornal</h2>
      <button 
        className={`menu-btn ${moduloAtivo === 'noticias' ? 'active' : ''}`}
        onClick={() => setModuloAtivo('noticias')}
      >
        Notícias
      </button>
      <button 
        className={`menu-btn ${moduloAtivo === 'vagas' ? 'active' : ''}`}
        onClick={() => setModuloAtivo('vagas')}
      >
        Vagas de Emprego
      </button>
      <button 
        className={`menu-btn ${moduloAtivo === 'acervo' ? 'active' : ''}`}
        onClick={() => setModuloAtivo('acervo')}
      >
        Acervo Carb
      </button>
      <button>
      // Exemplo de botão no Frontend
      <a 
        href="https://wa.me/5571999999999?text=Olá! Preciso de ajuda com a matrícula no CARB." 
        target="_blank" 
        rel="noopener noreferrer"
        className="btn-whatsapp"
      >
        💬 Falar com Agente de Matrícula
      </a>
      </button>      
    </nav>
  );
}