import '../setupTests.ts';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import Acervo from './Acervo';

vi.mock('axios');

describe('Acervo Component', () => {
  it('deve renderizar a lista de documentos', async () => {
    const mockData = [
      { id: 1, ano: 2024, categoria: 'Ata', titulo: 'Ata 01', arquivo_url: '/docs/ata1.pdf' }
    ];
    axios.get.mockResolvedValueOnce({ data: mockData });
    
    render(<Acervo />);
    
    await waitFor(() => {
      expect(screen.getByText(/2024 - Ata:/)).toBeInTheDocument();
      expect(screen.getByText('Ata 01')).toBeInTheDocument();
      expect(screen.getByText('[Baixar PDF]')).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem se o acervo estiver vazio', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<Acervo />);
    
    await waitFor(() => {
      expect(screen.getByText('Nenhum documento encontrado.')).toBeInTheDocument();
    });
  });
});
