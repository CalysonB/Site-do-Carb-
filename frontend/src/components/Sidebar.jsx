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
      <button 
        className={`menu-btn ${moduloAtivo === 'ouvidoria' ? 'active' : ''}`}
        onClick={() => setModuloAtivo('ouvidoria')}
      >
        Ouvidoria
      </button>      
    </nav>
  );
}