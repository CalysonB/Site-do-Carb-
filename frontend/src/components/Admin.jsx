import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('carb_admin_token'));
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [erro, setErro] = useState('');

  const sair = () => {
    setToken(null);
    localStorage.removeItem('carb_admin_token');
  };

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [resSugestoes, resNoticias] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/ouvidoria`, config),
          axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/noticias?page=1`)
        ]);
        setSugestoes(resSugestoes.data || []);
        setNoticias(resNoticias.data?.noticias || []);
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
        if (e?.response?.status === 401 || e?.response?.status === 403) {
          sair(); 
        }
      }
    };

    if (token) carregarDados();
  }, [token]);

  const fazerLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/login`, { usuario, senha });
      setToken(res.data.token);
      localStorage.setItem('carb_admin_token', res.data.token);
      setErro('');
    } catch (e) {
      console.error("Erro de login:", e);
      setErro('Acesso negado. Credenciais inválidas.');
    }
  };

  const apagarNoticia = async (id) => {
    if (!window.confirm('Tem a certeza que deseja apagar esta notícia permanentemente?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/noticias/${id}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setNoticias(noticias.filter(n => n.id !== id));
    } catch (e) {
      console.error("Erro ao apagar:", e);
      alert('Erro ao apagar notícia.');
    }
  };

  if (!token) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-color)', color: 'white' }}>
        <form onSubmit={fazerLogin} style={{ padding: '40px', backgroundColor: '#16181c', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px', width: '350px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ textAlign: 'center', color: 'var(--text-main)' }}>Acesso Restrito</h2>
          {erro && <p style={{ color: 'var(--error-color)', fontSize: '0.9rem', textAlign: 'center' }}>{erro}</p>}
          <input 
            placeholder="Utilizador Admin" value={usuario} onChange={e => setUsuario(e.target.value)} 
            style={{ padding: '12px', background: '#202327', color: 'white', border: 'none', borderRadius: '8px', outline: 'none' }}
          />
          <input 
            type="password" placeholder="Palavra-passe" value={senha} onChange={e => setSenha(e.target.value)} 
            style={{ padding: '12px', background: '#202327', color: 'white', border: 'none', borderRadius: '8px', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '12px', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer' }}>
            Entrar
          </button>
          <a href="/" style={{ textAlign: 'center', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', marginTop: '10px' }}>Voltar ao Portal</a>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-main)', height: '100vh', overflowY: 'auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1>Backoffice CARB</h1>
        <div>
          <a href="/" style={{ marginRight: '20px', color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 'bold' }}>Ir para o Site</a>
          <button onClick={sair} style={{ padding: '8px 20px', background: 'var(--error-color)', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer' }}>Sair</button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <h2 style={{ marginBottom: '20px', borderBottom: '2px solid var(--accent-color)', display: 'inline-block', paddingBottom: '5px' }}>Caixa da Ouvidoria</h2>
          {sugestoes.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>Nenhuma sugestão no momento.</p> : sugestoes.map(s => (
            <div key={s.id} style={{ padding: '20px', background: '#16181c', marginBottom: '15px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>{new Date(s.createdAt).toLocaleString('pt-PT')}</span>
              <p style={{ lineHeight: '1.6' }}>{s.mensagem}</p>
            </div>
          ))}
        </div>

        <div style={{ flex: '1 1 400px' }}>
          <h2 style={{ marginBottom: '20px', borderBottom: '2px solid var(--accent-color)', display: 'inline-block', paddingBottom: '5px' }}>Gerir Notícias</h2>
          {noticias.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>Nenhuma notícia encontrada.</p> : noticias.map(n => (
            <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', background: '#16181c', marginBottom: '10px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontWeight: 'bold', maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.titulo}</span>
              <button onClick={() => apagarNoticia(n.id)} style={{ background: 'transparent', color: 'var(--error-color)', border: '1px solid var(--error-color)', padding: '5px 15px', borderRadius: '9999px', cursor: 'pointer', transition: '0.2s' }}>Apagar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}