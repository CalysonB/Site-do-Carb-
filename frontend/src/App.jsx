// src/App.jsx
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import FeedNoticias from './components/FeedNoticias';
import PainelDireito from './components/PainelDireito'; // Onde ficará a pesquisa
import Ouvidoria from './components/Ouvidoria';
import './index.css';

function App() {
  const [moduloAtivo, setModuloAtivo] = useState('noticias');

  return (
    <div className="twitter-layout">
      {/* Coluna Esquerda: Navegação estilo Twitter */}
      <Sidebar moduloAtivo={moduloAtivo} setModuloAtivo={setModuloAtivo} />

      {/* Coluna Central: Onde as coisas acontecem (Timeline) */}
      <main className="timeline-center">
        {moduloAtivo === 'noticias' && <FeedNoticias />}
        {moduloAtivo === 'ouvidoria' && <Ouvidoria />}
      </main>

      {/* Coluna Direita: Pesquisa e Agente de Matrícula */}
      <aside className="right-panel">
        <PainelDireito setModuloAtivo={setModuloAtivo} />
      </aside>
    </div>
  );
}
export default App;