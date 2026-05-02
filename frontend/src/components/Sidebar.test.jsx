import '../setupTests.ts';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from './Sidebar';

describe('Sidebar Component', () => {
  it('deve renderizar todos os botões do menu', () => {
    render(<Sidebar moduloAtivo="noticias" setModuloAtivo={() => {}} />);
    expect(screen.getByText('Notícias')).toBeInTheDocument();
    expect(screen.getByText('Vagas de Emprego')).toBeInTheDocument();
    expect(screen.getByText('Acervo Carb')).toBeInTheDocument();
  });

  it('deve chamar setModuloAtivo ao clicar em um botão', () => {
    const setModuloAtivo = vi.fn();
    render(<Sidebar moduloAtivo="noticias" setModuloAtivo={setModuloAtivo} />);
    
    fireEvent.click(screen.getByText('Vagas de Emprego'));
    expect(setModuloAtivo).toHaveBeenCalledWith('vagas');
    
    fireEvent.click(screen.getByText('Acervo Carb'));
    expect(setModuloAtivo).toHaveBeenCalledWith('acervo');
  });

  it('deve aplicar a classe active ao botão do módulo ativo', () => {
    render(<Sidebar moduloAtivo="vagas" setModuloAtivo={() => {}} />);
    const vagasBtn = screen.getByText('Vagas de Emprego');
    expect(vagasBtn).toHaveClass('active');
  });
});
