import '../setupTests.ts';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import FeedNoticias from './FeedNoticias';

vi.mock('axios');

describe('FeedNoticias Component', () => {
  const n1 = { id: 1, titulo: 'N1', conteudo: 'Linha 1\nLinha 2', upvotes: 0, downvotes: 0 };
  const n2 = { id: 2, titulo: 'N2', conteudo: 'C2 [FOTO]', imagem_capa: '/i.jpg', upvotes: 0, downvotes: 0 };

  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    window.alert = vi.fn();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockResolvedValue({ data: { noticias: [n1, n2], total_paginas: 2 } });
  });

  it('renderiza noticias com quebras de linha e fotos seguras', async () => {
    render(<FeedNoticias />);
    expect(await screen.findByText('N1')).toBeInTheDocument();
    expect(screen.getByText('Linha 1')).toBeInTheDocument();
    expect(screen.getByText('Linha 2')).toBeInTheDocument();
    expect(screen.getByAltText('Capa da notícia')).toBeInTheDocument();
  });

  it('navega entre paginas (proxima e anterior)', async () => {
    render(<FeedNoticias />);
    const prox = await screen.findByText('Próxima');
    fireEvent.click(prox);
    await waitFor(() => expect(screen.getByText('Página 2 de 2')).toBeInTheDocument());
    
    const ant = screen.getByText('Anterior');
    fireEvent.click(ant);
    await waitFor(() => expect(screen.getByText('Página 1 de 2')).toBeInTheDocument());
  });

  it('vota e atualiza estado', async () => {
    axios.post.mockResolvedValueOnce({ data: { up: 5, down: 0 } });
    render(<FeedNoticias />);
    const buttons = await screen.findAllByText('👍');
    fireEvent.click(buttons[0]);
    await waitFor(() => expect(screen.getByText('5')).toBeInTheDocument());
    
    axios.post.mockResolvedValueOnce({ data: { up: 0, down: 20 } });
    const downButtons = screen.getAllByText('👎');
    fireEvent.click(downButtons[1]); // Vota na n2 (id: 2)
    await waitFor(() => expect(screen.getByText('20')).toBeInTheDocument());
  });

  it('erro ao votar', async () => {
    axios.post.mockRejectedValueOnce(new Error('Vote Fail'));
    render(<FeedNoticias />);
    const buttons = await screen.findAllByText('👍');
    fireEvent.click(buttons[0]);
    await waitFor(() => expect(console.error).toHaveBeenCalledWith("Erro ao votar", expect.anything()));
  });

  it('erro carregar noticias', async () => {
    axios.get.mockRejectedValueOnce(new Error());
    render(<FeedNoticias />);
    await waitFor(() => expect(console.error).toHaveBeenCalled());
  });

  it('vota repetido', async () => {
    localStorage.setItem('votou-1', 'true');
    render(<FeedNoticias />);
    const buttons = await screen.findAllByText('👍');
    fireEvent.click(buttons[0]);
    expect(window.alert).toHaveBeenCalled();
  });

  it('deve usar fallbacks se a API retornar dados nulos ou incompletos', async () => {
    axios.get.mockResolvedValueOnce({ data: { noticias: [{ id: 3, titulo: 'T3', conteudo: null }], total_paginas: null } });
    render(<FeedNoticias />);
    expect(await screen.findByText('T3')).toBeInTheDocument();
    expect(screen.getByText('Página 1 de 1')).toBeInTheDocument();
  });
});
