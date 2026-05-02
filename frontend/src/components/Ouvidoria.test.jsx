import '../setupTests.ts';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import Ouvidoria from './Ouvidoria';

vi.mock('axios');

describe('Ouvidoria Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renderiza corretamente', () => {
    render(<Ouvidoria />);
    expect(screen.getByPlaceholderText('O que está a acontecer?')).toBeInTheDocument();
  });

  it('não envia vazio ou espaços', async () => {
    render(<Ouvidoria />);
    const btn = screen.getByText('Enviar Anonimamente');
    fireEvent.click(btn);
    expect(axios.post).not.toHaveBeenCalled();

    fireEvent.change(screen.getByPlaceholderText('O que está a acontecer?'), { target: { value: '   ' } });
    fireEvent.click(btn);
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('sucesso e limpa status', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    render(<Ouvidoria />);
    fireEvent.change(screen.getByPlaceholderText('O que está a acontecer?'), { target: { value: 'Oi' } });
    fireEvent.click(screen.getByText('Enviar Anonimamente'));

    expect(await screen.findByText(/enviada anonimamente/)).toBeInTheDocument();
    vi.advanceTimersByTime(5000);
    await waitFor(() => expect(screen.queryByText(/enviada anonimamente/)).not.toBeInTheDocument());
  });

  it('erro api', async () => {
    axios.post.mockRejectedValueOnce(new Error());
    render(<Ouvidoria />);
    fireEvent.change(screen.getByPlaceholderText('O que está a acontecer?'), { target: { value: 'Erro' } });
    fireEvent.click(screen.getByText('Enviar Anonimamente'));
    expect(await screen.findByText(/Erro ao enviar/)).toBeInTheDocument();
  });
});
