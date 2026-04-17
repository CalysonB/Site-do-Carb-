import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Noticias from './components/Noticias';
import Vagas from './components/Vagas';
import Acervo from './components/Acervo';
import './index.css';

function App() {
  const [moduloAtivo, setModuloAtivo] = useState('noticias');
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <button className="menu-trigger" onClick={() => setMenuMobileAberto(!menuMobileAberto)}>☰</button>

      <Sidebar 
        moduloAtivo={moduloAtivo} 
        setModuloAtivo={(mod) => { setModuloAtivo(mod); setMenuMobileAberto(false); }} 
        menuAberto={menuMobileAberto}
      />

      <main className="content" onClick={() => setMenuMobileAberto(false)}>
        {moduloAtivo === 'noticias' && <Noticias />}
        {moduloAtivo === 'vagas' && <Vagas />}
        {moduloAtivo === 'acervo' && <Acervo />}
        {moduloAtivo === 'matricula' && <section className="modulo ativo"><h1>Agente de Matrícula</h1><p>Em breve...</p></section>}
      </main>
    </div>
  );
}

export default App;