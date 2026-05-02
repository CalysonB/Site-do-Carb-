import './setupTests.ts';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// Mocks para evitar chamadas de API reais e isolar o App
vi.mock('./components/FeedNoticias', () => ({ default: () => <div data-testid="feed">Feed</div> }));
vi.mock('./components/Ouvidoria', () => ({ default: () => <div data-testid="ouvidoria">Ouvidoria</div> }));
vi.mock('./components/Vagas', () => ({ default: () => <div data-testid="vagas">Vagas</div> }));
vi.mock('./components/Acervo', () => ({ default: () => <div data-testid="acervo">Acervo</div> }));
vi.mock('./components/Admin', () => ({ default: () => <div data-testid="admin">Admin</div> }));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window.location
    delete window.location;
    window.location = { pathname: '/' };
  });

  it('deve renderizar o layout principal por padrão', () => {
    render(<App />);
    expect(screen.getByText('CARB Jornal')).toBeInTheDocument();
    expect(screen.getByTestId('feed')).toBeInTheDocument();
  });

  it('deve renderizar o componente Admin se o pathname for /admin', () => {
    window.location.pathname = '/admin';
    render(<App />);
    expect(screen.getByTestId('admin')).toBeInTheDocument();
  });

  it('deve alternar entre os módulos ao clicar na sidebar', () => {
    render(<App />);
    
    fireEvent.click(screen.getByText('Ouvidoria'));
    expect(screen.getByTestId('ouvidoria')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Vagas de Emprego'));
    expect(screen.getByTestId('vagas')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Acervo Carb'));
    expect(screen.getByTestId('acervo')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Notícias'));
    expect(screen.getByTestId('feed')).toBeInTheDocument();
  });
});
