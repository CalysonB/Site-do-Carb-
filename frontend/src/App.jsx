import { useState } from 'react';
import Sidebar from './components/Sidebar';
import FeedNoticias from './components/FeedNoticias';
import PainelDireito from './components/PainelDireito';
import Ouvidoria from './components/Ouvidoria';
import Vagas from './components/Vagas';
import Acervo from './components/Acervo';
import Admin from './components/Admin'; // IMPORTAMOS O ADMIN
import './index.css';

export default function App() {
  const [moduloAtivo, setModuloAtivo] = useState('noticias');

  // A MAGIA DA ROTA SECRETA ACONTECE AQUI:
  if (window.location.pathname === '/admin') {
    return <Admin />;
  }

  // Se não estiver no admin, mostra o portal normal aos alunos
  return (
    <div className="twitter-layout">
      {/* Coluna Esquerda */}
      <Sidebar moduloAtivo={moduloAtivo} setModuloAtivo={setModuloAtivo} />

      {/* Coluna Central */}
      <main className="timeline-center">
        {moduloAtivo === 'noticias' && <FeedNoticias />}
        {moduloAtivo === 'ouvidoria' && <Ouvidoria />}
        {moduloAtivo === 'vagas' && <Vagas />}
        {moduloAtivo === 'acervo' && <Acervo />}
      </main>

      {/* Coluna Direita */}
      <aside className="right-panel">
        <PainelDireito setModuloAtivo={setModuloAtivo} />
      </aside>
    </div>
  );
}