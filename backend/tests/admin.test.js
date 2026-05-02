import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { Noticia, Sugestao } from '../models.js';
import jwt from 'jsonwebtoken';

vi.mock('../models.js', () => ({
  Noticia: { destroy: vi.fn(), findAndCountAll: vi.fn(), findByPk: vi.fn(), create: vi.fn() },
  Sugestao: { findAll: vi.fn(), create: vi.fn() }
}));

describe('Admin Protected Routes', () => {
  const secret = 'testsecret';
  let token;

  beforeEach(() => {
    process.env.JWT_SECRET = secret;
    token = jwt.sign({ admin: true }, secret);
    vi.clearAllMocks();
  });

  it('deve negar acesso sem token (403)', async () => {
    const res = await request(app).get('/api/ouvidoria');
    expect(res.status).toBe(403);
  });

  it('deve negar acesso com token inválido (401)', async () => {
    const res = await request(app)
      .get('/api/ouvidoria')
      .set('Authorization', 'Bearer invalid');
    expect(res.status).toBe(401);
  });

  it('deve permitir acesso à ouvidoria com token válido', async () => {
    Sugestao.findAll.mockResolvedValue([{ id: 1, mensagem: 'Teste' }]);
    const res = await request(app)
      .get('/api/ouvidoria')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('deve retornar 500 se houver erro ao listar sugestões', async () => {
    Sugestao.findAll.mockRejectedValue(new Error('Fetch Fail'));
    const res = await request(app)
      .get('/api/ouvidoria')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(500);
    expect(res.body.erro).toBe('Erro ao listar sugestões.');
  });

  it('deve apagar notícia com sucesso', async () => {
    Noticia.destroy.mockResolvedValue(1);
    const res = await request(app)
      .delete('/api/noticias/1')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.mensagem).toBe('Notícia removida.');
    expect(Noticia.destroy).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('deve retornar 500 se houver erro no banco ao apagar', async () => {
    Noticia.destroy.mockRejectedValue(new Error('DB Fail'));
    const res = await request(app)
      .delete('/api/noticias/1')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(500);
    expect(res.body.erro).toBe('Erro ao remover notícia.');
  });
});
