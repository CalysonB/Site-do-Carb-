import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { Noticia } from '../models.js';
import jwt from 'jsonwebtoken';

vi.mock('../models.js', () => ({
  Noticia: { 
    findAndCountAll: vi.fn(), 
    findByPk: vi.fn(),
    create: vi.fn(),
    destroy: vi.fn()
  },
  Sugestao: { findAll: vi.fn(), create: vi.fn() }
}));

describe('News API', () => {
  const secret = 'testsecret';
  let token;

  beforeEach(() => {
    process.env.JWT_SECRET = secret;
    token = jwt.sign({ admin: true }, secret);
    vi.clearAllMocks();
  });

  it('deve listar notícias com paginação', async () => {
    Noticia.findAndCountAll.mockResolvedValue({
      count: 1,
      rows: [{ id: 1, titulo: 'Teste' }]
    });

    const res = await request(app).get('/api/noticias?page=1');
    expect(res.status).toBe(200);
    expect(res.body.noticias).toHaveLength(1);
    expect(res.body.total_paginas).toBe(1);
  });

  it('deve retornar 500 ao falhar listagem', async () => {
    Noticia.findAndCountAll.mockRejectedValue(new Error('Fail'));
    const res = await request(app).get('/api/noticias');
    expect(res.status).toBe(500);
    expect(res.body.erro).toBe('Erro ao carregar notícias.');
  });

  it('deve votar up em uma notícia', async () => {
    const mockNoticia = { id: 1, upvotes: 0, downvotes: 0, save: vi.fn() };
    Noticia.findByPk.mockResolvedValue(mockNoticia);

    const res = await request(app)
      .post('/api/noticias/1/voto')
      .send({ tipo: 'up' });

    expect(res.status).toBe(200);
    expect(res.body.up).toBe(1);
    expect(mockNoticia.save).toHaveBeenCalled();
  });

  it('deve votar down em uma notícia', async () => {
    const mockNoticia = { id: 1, upvotes: 0, downvotes: 0, save: vi.fn() };
    Noticia.findByPk.mockResolvedValue(mockNoticia);

    const res = await request(app)
      .post('/api/noticias/1/voto')
      .send({ tipo: 'down' });

    expect(res.status).toBe(200);
    expect(res.body.down).toBe(1);
  });

  it('não deve alterar votos se o tipo for inválido', async () => {
    const mockNoticia = { id: 1, upvotes: 0, downvotes: 0, save: vi.fn() };
    Noticia.findByPk.mockResolvedValue(mockNoticia);

    const res = await request(app)
      .post('/api/noticias/1/voto')
      .send({ tipo: 'invalido' });

    expect(res.status).toBe(200);
    expect(mockNoticia.upvotes).toBe(0);
    expect(mockNoticia.downvotes).toBe(0);
  });

  it('deve retornar 404 se notícia não existir no voto', async () => {
    Noticia.findByPk.mockResolvedValue(null);
    const res = await request(app).post('/api/noticias/999/voto').send({ tipo: 'up' });
    expect(res.status).toBe(404);
  });

  it('deve retornar 500 se erro ao votar', async () => {
    Noticia.findByPk.mockRejectedValue(new Error('Fail'));
    const res = await request(app).post('/api/noticias/1/voto').send({ tipo: 'up' });
    expect(res.status).toBe(500);
  });

  it('deve criar notícia como admin', async () => {
    Noticia.create.mockResolvedValue({ id: 1, titulo: 'Nova' });
    const res = await request(app)
      .post('/api/noticias')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Nova', conteudo: 'C', imagem_capa: '/i.jpg' });

    expect(res.status).toBe(201);
    expect(res.body.titulo).toBe('Nova');
  });

  it('deve falhar se campos faltando na criação', async () => {
    const res = await request(app)
      .post('/api/noticias')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Só título' });

    expect(res.status).toBe(400);
  });

  it('deve retornar 500 se erro ao criar notícia', async () => {
    Noticia.create.mockRejectedValue(new Error('Fail'));
    const res = await request(app)
      .post('/api/noticias')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'T', conteudo: 'C' });
    expect(res.status).toBe(500);
  });
});
