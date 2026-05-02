import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import fs from 'fs';
import jwt from 'jsonwebtoken';

vi.mock('fs');

describe('Upload API (Fortified)', () => {
  const secret = 'testsecret';
  let token;

  beforeEach(() => {
    process.env.JWT_SECRET = secret;
    token = jwt.sign({ admin: true }, secret);
    vi.clearAllMocks();
  });

  it('deve negar upload sem Token Admin', async () => {
    const res = await request(app)
      .post('/api/upload')
      .send({});
    
    expect(res.status).toBe(403);
    expect(res.body.erro).toContain('Token não fornecido');
  });

  it('deve processar upload com JWT válido', async () => {
    fs.writeFileSync.mockReturnValue(undefined);
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${token}`)
      .send({
        imagem: { nome: 'foto.jpg', base64: 'YmFzZTY0ZGF0YQ==' }
      });
    
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('deve falhar com extensão proibida', async () => {
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${token}`)
      .send({
        imagem: { nome: 'virus.exe', base64: '...' }
      });
    
    expect(res.status).toBe(400); // Mudamos de 500 para 400 no refactor para ser mais semântico
    expect(res.body.erro).toBe('Tipo Proibido');
  });

  it('deve retornar 400 se não houver imagem', async () => {
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Só texto' });
    
    expect(res.status).toBe(400);
    expect(res.body.erro).toBe('Nenhuma imagem fornecida.');
  });
});
