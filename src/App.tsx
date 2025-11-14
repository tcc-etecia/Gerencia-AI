import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import RecuperarSenha from './components/RecuperarSenha';
import Dashboard from './components/Dashboard';

type Page = 'login' | 'cadastro' | 'recuperar' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [usuarioLogado, setUsuarioLogado] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem('usuarioLogado');
    if (user) {
      setUsuarioLogado(JSON.parse(user));
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = (usuario: any) => {
    setUsuarioLogado(usuario);
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUsuarioLogado(null);
    localStorage.removeItem('usuarioLogado');
    setCurrentPage('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onNavigate={setCurrentPage} onLogin={handleLogin} />;
      case 'cadastro':
        return <Cadastro onNavigate={setCurrentPage} />;
      case 'recuperar':
        return <RecuperarSenha onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard usuario={usuarioLogado} onLogout={handleLogout} />;
      default:
        return <Login onNavigate={setCurrentPage} onLogin={handleLogin} />;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        {renderPage()}
      </div>
      <Toaster />
    </>
  );
}
