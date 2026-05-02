import '../setupTests.ts';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import Vagas from './Vagas';

vi.mock('axios');

describe('Vagas Component', () => {
  it('deve renderizar a lista de vagas', async () => {
    const mockVagas = [
      { id: 1, cargo: 'Desenvolvedor', escritorio: 'Empresa X', detalhes: { Requisitos: 'React' } }
    ];
    axios.get.mockResolvedValueOnce({ data: mockVagas });
    
    render(<Vagas />);
    
    await waitFor(() => {
      expect(screen.getByText('Desenvolvedor')).toBeInTheDocument();
      expect(screen.getByText('Empresa X')).toBeInTheDocument();
      expect(screen.getByText(/Requisitos:React/)).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem se não houver vagas', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<Vagas />);
    
    await waitFor(() => {
      expect(screen.getByText('Nenhuma vaga disponível no momento.')).toBeInTheDocument();
    });
  });

  it('deve exibir texto padrão se não houver detalhes', async () => {
    const mockVagas = [
      { id: 1, cargo: 'Estágio', escritorio: 'Empresa Y', detalhes: null }
    ];
    axios.get.mockResolvedValueOnce({ data: mockVagas });
    
    render(<Vagas />);
    
    await waitFor(() => {
      expect(screen.getByText('Verifique os requisitos.')).toBeInTheDocument();
    });
  });
});
