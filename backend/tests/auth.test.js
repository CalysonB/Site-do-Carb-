import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';

describe('Auth API', () => {
  beforeEach(() => {
    process.env.ADMIN_USER = 'admin';
    process.env.ADMIN_PASS = '123456';
    process.env.JWT_SECRET = 'secret';
  });

  it('deve fazer login com sucesso', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ usuario: 'admin', senha: '123456' });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    
    const decoded = jwt.verify(res.body.token, 'secret');
    expect(decoded.admin).toBe(true);
  });

  it('deve falhar com credenciais inválidas', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ usuario: 'wrong', senha: 'wrong' });
    
    expect(res.status).toBe(401);
    expect(res.body.erro).toBe('Credenciais inválidas');
  });
});
