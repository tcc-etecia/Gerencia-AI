import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Eye, EyeOff } from 'lucide-react';

type Page = 'login' | 'cadastro' | 'recuperar' | 'dashboard';

interface LoginProps {
  onNavigate: (page: Page) => void;
  onLogin: (usuario: any) => void;
}

export default function Login({ onNavigate, onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find((u: any) => u.email === email && u.senha === senha);

    if (usuario) {
      onLogin(usuario);
      setMensagem('');
    } else {
      setMensagem('Email ou senha incorretos');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 p-12 flex-col justify-center items-center text-white">
        <div className="max-w-md">
          <h1 className="text-5xl mb-6">Gerencia.aí</h1>
          <p className="text-xl opacity-90">
            Gerencie seu negócio de forma simples e eficiente. Controle produtos, estoque, financeiro e muito mais.
          </p>
        </div>
      </div>

      {/* Lado direito */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="mb-2">Bem-vindo de volta</h2>
            <p className="text-muted-foreground">Entre com suas credenciais para acessar o sistema</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={showSenha ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="bg-input-background border-border pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>

          {mensagem && (
            <p className="mt-4 text-destructive text-center">{mensagem}</p>
          )}

          <div className="mt-6 flex items-center">
            <div className="flex-1 border-t border-border"></div>
            <span className="px-4 text-muted-foreground">ou</span>
            <div className="flex-1 border-t border-border"></div>
          </div>

          <div className="mt-6 space-y-3 text-center">
            <button
              onClick={() => onNavigate('recuperar')}
              className="text-primary hover:underline block w-full"
            >
              Esqueceu sua senha?
            </button>
            <button
              onClick={() => onNavigate('cadastro')}
              className="text-primary hover:underline block w-full"
            >
              Criar nova conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
