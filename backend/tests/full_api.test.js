import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { Aviso, Vaga, Acervo, Noticia, Sugestao } from '../models.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';

vi.mock('../models.js', () => ({
  Sugestao: { findAll: vi.fn(), create: vi.fn() },
  Noticia: { findAndCountAll: vi.fn(), findByPk: vi.fn(), create: vi.fn(), destroy: vi.fn() },
  Aviso: { findAll: vi.fn(), create: vi.fn(), destroy: vi.fn() },
  Vaga: { findAll: vi.fn(), create: vi.fn(), destroy: vi.fn() },
  Acervo: { findAll: vi.fn(), create: vi.fn(), destroy: vi.fn() }
}));

vi.mock('fs');

describe('Final Absolute 100% Coverage', () => {
  const secret = 'testsecret';
  let token;

  beforeEach(() => {
    process.env.JWT_SECRET = secret;
    token = jwt.sign({ admin: true }, secret);
    vi.clearAllMocks();
  });

  // Helper para testar Sucesso e Falha
  const testRoute = (method, url, model, mockMethod, payload = {}, auth = false) => {
    it(`${method.toUpperCase()} ${url} - Success`, async () => {
      model[mockMethod].mockResolvedValue(payload.res || { id: 1 });
      const req = request(app)[method](url);
      if (auth) req.set('Authorization', `Bearer ${token}`);
      const res = await req.send(payload.body || {});
      expect(res.status).toBeGreaterThanOrEqual(200);
      expect(res.status).toBeLessThan(300);
    });

    it(`${method.toUpperCase()} ${url} - Catch 500`, async () => {
      model[mockMethod].mockRejectedValue(new Error('Fail'));
      const req = request(app)[method](url);
      if (auth) req.set('Authorization', `Bearer ${token}`);
      const res = await req.send(payload.body || {});
      expect(res.status).toBe(500);
    });
  };

  // Rotas Públicas
  testRoute('get', '/api/noticias', Noticia, 'findAndCountAll', { res: { count: 0, rows: [] } });
  testRoute('get', '/api/avisos', Aviso, 'findAll');
  testRoute('get', '/api/vagas', Vaga, 'findAll');
  testRoute('get', '/api/acervo', Acervo, 'findAll');
  testRoute('post', '/api/noticias/1/voto', Noticia, 'findByPk', { body: { tipo: 'up' }, res: { upvotes: 0, save: vi.fn() } });
  testRoute('post', '/api/ouvidoria', Sugestao, 'create', { body: { mensagem: 'Ola' } });

  // Rotas Admin
  testRoute('get', '/api/ouvidoria', Sugestao, 'findAll', {}, true);
  testRoute('post', '/api/noticias', Noticia, 'create', { body: { titulo: 'T', conteudo: 'C' } }, true);
  testRoute('delete', '/api/noticias/1', Noticia, 'destroy', {}, true);
  
  testRoute('post', '/api/avisos', Aviso, 'create', { body: { titulo: 'T' } }, true);
  testRoute('delete', '/api/avisos/1', Aviso, 'destroy', {}, true);
  
  testRoute('post', '/api/vagas', Vaga, 'create', { body: { cargo: 'C' } }, true);
  testRoute('delete', '/api/vagas/1', Vaga, 'destroy', {}, true);
  
  testRoute('post', '/api/acervo', Acervo, 'create', { body: { titulo: 'T' } }, true);
  testRoute('delete', '/api/acervo/1', Acervo, 'destroy', {}, true);

  // Upload Especial
  it('POST /api/upload - Success', async () => {
    fs.writeFileSync.mockReturnValue(undefined);
    const res = await request(app).post('/api/upload').set('Authorization', `Bearer ${token}`).send({ imagem: { nome: 'a.jpg', base64: 'YQ==' } });
    expect(res.status).toBe(200);
  });

  it('POST /api/upload - Catch 500', async () => {
    fs.writeFileSync.mockImplementation(() => { throw new Error(); });
    const res = await request(app).post('/api/upload').set('Authorization', `Bearer ${token}`).send({ imagem: { nome: 'a.jpg', base64: 'YQ==' } });
    expect(res.status).toBe(500);
  });

  // 404 Case
  it('POST /api/noticias/1/voto - 404', async () => {
    Noticia.findByPk.mockResolvedValue(null);
    const res = await request(app).post('/api/noticias/1/voto').send({ tipo: 'up' });
    expect(res.status).toBe(404);
  });

  it('POST /api/noticias - 400 Title Long', async () => {
    const res = await request(app).post('/api/noticias').set('Authorization', `Bearer ${token}`).send({ titulo: 'a'.repeat(201), conteudo: 'c' });
    expect(res.status).toBe(400);
  });

  it('POST /api/noticias - 400 Content Long', async () => {
    const res = await request(app).post('/api/noticias').set('Authorization', `Bearer ${token}`).send({ titulo: 't', conteudo: 'a'.repeat(10001) });
    expect(res.status).toBe(400);
  });

  it('POST /api/ouvidoria - 400 Msg Long', async () => {
    const res = await request(app).post('/api/ouvidoria').send({ mensagem: 'a'.repeat(2001) });
    expect(res.status).toBe(400);
  });
});
