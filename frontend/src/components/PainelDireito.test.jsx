import '../setupTests.ts';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PainelDireito from './PainelDireito';

describe('PainelDireito Component', () => {
  beforeEach(() => {
    window.alert = vi.fn();
  });

  it('deve renderizar a barra de busca e o card do whatsapp', () => {
    render(<PainelDireito />);
    expect(screen.getByPlaceholderText('Buscar no CARB...')).toBeInTheDocument();
    expect(screen.getByText('Agente de Matrícula')).toBeInTheDocument();
    expect(screen.getByText('💬 Falar no WhatsApp')).toBeInTheDocument();
  });

  it('deve atualizar o estado da busca e exibir alert ao pesquisar', () => {
    render(<PainelDireito />);
    const input = screen.getByPlaceholderText('Buscar no CARB...');
    
    fireEvent.change(input, { target: { value: 'test search' } });
    expect(input.value).toBe('test search');

    fireEvent.submit(screen.getByRole('textbox').closest('form'));
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('test search'));
  });

  it('deve conter o link correto para o WhatsApp', () => {
    render(<PainelDireito />);
    const link = screen.getByText('💬 Falar no WhatsApp');
    expect(link).toHaveAttribute('href', expect.stringContaining('wa.me/5571999999999'));
    expect(link).toHaveAttribute('target', '_blank');
  });
});
