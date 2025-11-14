import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

type Page = 'login' | 'cadastro' | 'recuperar' | 'dashboard';

interface RecuperarSenhaProps {
  onNavigate: (page: Page) => void;
}

export default function RecuperarSenha({ onNavigate }: RecuperarSenhaProps) {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find((u: any) => u.email === email);

    if (usuario) {
      setMensagem('Instruções de recuperação foram enviadas para seu e-mail!');
      setSucesso(true);
      
      setTimeout(() => {
        onNavigate('login');
      }, 3000);
    } else {
      setMensagem('E-mail não encontrado no sistema');
      setSucesso(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 p-12 flex-col justify-center items-center text-white">
        <div className="max-w-md">
          <h1 className="text-5xl mb-6">Gerencia.aí</h1>
          <p className="text-xl opacity-90">
            Esqueceu sua senha? Não se preocupe, vamos te ajudar a recuperá-la.
          </p>
        </div>
      </div>

      {/* Lado direito */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="mb-2">Recuperar Senha</h2>
            <p className="text-muted-foreground">Digite seu email para receber instruções de recuperação</p>
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

            <Button type="submit" className="w-full">
              Enviar instruções
            </Button>
          </form>

          {mensagem && (
            <p className={`mt-4 text-center ${sucesso ? 'text-green-600' : 'text-destructive'}`}>
              {mensagem}
            </p>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate('login')}
              className="text-primary hover:underline"
            >
              Voltar ao login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
