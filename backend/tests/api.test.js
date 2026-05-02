import { vi, describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { Sugestao } from '../models.js';

vi.mock('../models.js', () => {
  return {
    Sugestao: {
      create: vi.fn(),
    },
    Noticia: { destroy: vi.fn() }
  };
});

describe('API Ouvidoria', () => {
  it('deve enviar uma sugestão com sucesso', async () => {
    Sugestao.create.mockResolvedValueOnce({ id: 1 });
    const response = await request(app)
      .post('/api/ouvidoria')
      .send({ mensagem: 'Minha sugestão de teste' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('sucesso');
  });

  it('deve falhar se a mensagem estiver vazia', async () => {
    const response = await request(app)
      .post('/api/ouvidoria')
      .send({ mensagem: '' });

    expect(response.status).toBe(400);
    expect(response.body.erro).toBe('Mensagem inválida ou muito longa.');
  });

  it('deve retornar 500 se o banco falhar no create', async () => {
    Sugestao.create.mockRejectedValueOnce(new Error('Fatal DB Error'));
    const response = await request(app)
      .post('/api/ouvidoria')
      .send({ mensagem: 'Error trigger' });

    expect(response.status).toBe(500);
    expect(response.body.erro).toBe('Erro ao enviar sugestão.');
  });
});
