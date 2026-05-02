import '../setupTests.ts';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import Admin from './Admin';

vi.mock('axios');

describe('Admin Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    window.confirm = vi.fn().mockReturnValue(true);
    window.alert = vi.fn();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Default mocks for API calls triggered by useEffect
    axios.get.mockImplementation((url) => {
      if (url.includes('ouvidoria')) return Promise.resolve({ data: [] });
      if (url.includes('noticias')) return Promise.resolve({ data: { noticias: [], total_paginas: 1 } });
      return Promise.resolve({ data: {} });
    });
  });

  it('renderiza login', () => {
    render(<Admin />);
    expect(screen.getByText('Acesso Restrito')).toBeInTheDocument();
  });

  it('login sucesso', async () => {
    axios.post.mockResolvedValueOnce({ data: { token: 'tk' } });
    render(<Admin />);
    fireEvent.change(screen.getByPlaceholderText('Utilizador Admin'), { target: { value: 'a' } });
    fireEvent.change(screen.getByPlaceholderText('Palavra-passe'), { target: { value: 'p' } });
    fireEvent.click(screen.getByText('Entrar'));
    await waitFor(() => expect(localStorage.getItem('carb_admin_token')).toBe('tk'));
  });

  it('login falha', async () => {
    axios.post.mockRejectedValueOnce(new Error());
    render(<Admin />);
    fireEvent.click(screen.getByText('Entrar'));
    await waitFor(() => expect(screen.getByText(/Acesso negado/)).toBeInTheDocument());
  });

  it('dashboard dados', async () => {
    localStorage.setItem('carb_admin_token', 'tk');
    axios.get.mockImplementation((url) => {
      if (url.includes('ouvidoria')) return Promise.resolve({ data: [{ id: 1, mensagem: 'Msg1', createdAt: new Date() }] });
      if (url.includes('noticias')) return Promise.resolve({ data: { noticias: [{ id: 1, titulo: 'Not1' }] } });
      return Promise.resolve({ data: {} });
    });
    render(<Admin />);
    await waitFor(() => {
      expect(screen.getByText('Msg1')).toBeInTheDocument();
      expect(screen.getByText('Not1')).toBeInTheDocument();
    });
  });

  it('fallbacks nulos', async () => {
    localStorage.setItem('carb_admin_token', 'tk');
    axios.get.mockImplementation((url) => {
      if (url.includes('ouvidoria')) return Promise.resolve({ data: null });
      if (url.includes('noticias')) return Promise.resolve({ data: { noticias: null } });
      return Promise.resolve({ data: null });
    });
    render(<Admin />);
    await waitFor(() => {
      expect(screen.getByText('Nenhuma sugestão no momento.')).toBeInTheDocument();
      expect(screen.getByText('Nenhuma notícia encontrada.')).toBeInTheDocument();
    });
  });

  it('apaga noticia', async () => {
    localStorage.setItem('carb_admin_token', 'tk');
    axios.get.mockImplementation((url) => {
      if (url.includes('noticias')) return Promise.resolve({ data: { noticias: [{ id: 1, titulo: 'DelMe' }] } });
      return Promise.resolve({ data: [] });
    });
    axios.delete.mockResolvedValueOnce({});
    render(<Admin />);
    fireEvent.click(await screen.findByText('Apagar'));
    await waitFor(() => expect(axios.delete).toHaveBeenCalled());
  });

  it('erro apagar', async () => {
    localStorage.setItem('carb_admin_token', 'tk');
    axios.get.mockImplementation((url) => {
      if (url.includes('noticias')) return Promise.resolve({ data: { noticias: [{ id: 1, titulo: 'Err' }] } });
      return Promise.resolve({ data: [] });
    });
    axios.delete.mockRejectedValueOnce(new Error());
    render(<Admin />);
    fireEvent.click(await screen.findByText('Apagar'));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Erro ao apagar notícia.'));
  });

  it('cancela apagar', async () => {
    localStorage.setItem('carb_admin_token', 'tk');
    axios.get.mockImplementation((url) => {
      if (url.includes('noticias')) return Promise.resolve({ data: { noticias: [{ id: 1, titulo: 'No' }] } });
      return Promise.resolve({ data: [] });
    });
    window.confirm.mockReturnValueOnce(false);
    render(<Admin />);
    fireEvent.click(await screen.findByText('Apagar'));
    expect(axios.delete).not.toHaveBeenCalled();
  });

  it('sair', async () => {
    localStorage.setItem('carb_admin_token', 'tk');
    render(<Admin />);
    fireEvent.click(await screen.findByText('Sair'));
    expect(localStorage.getItem('carb_admin_token')).toBeNull();
  });

  it('401/403 logout', async () => {
    localStorage.setItem('carb_admin_token', 'tk');
    axios.get.mockRejectedValueOnce({ response: { status: 401 } });
    render(<Admin />);
    await waitFor(() => expect(localStorage.getItem('carb_admin_token')).toBeNull());
    
    vi.resetAllMocks();
    localStorage.setItem('carb_admin_token', 'tk');
    axios.get.mockRejectedValueOnce({ response: { status: 403 } });
    render(<Admin />);
    await waitFor(() => expect(localStorage.getItem('carb_admin_token')).toBeNull());
  });

  it('500 no logout', async () => {
    localStorage.setItem('carb_admin_token', 'tk');
    axios.get.mockRejectedValueOnce({ response: { status: 500 } });
    render(<Admin />);
    await waitFor(() => expect(localStorage.getItem('carb_admin_token')).toBe('tk'));
  });
});
