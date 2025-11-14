import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Eye, EyeOff } from 'lucide-react';

type Page = 'login' | 'cadastro' | 'recuperar' | 'dashboard';

interface CadastroProps {
  onNavigate: (page: Page) => void;
}

export default function Cadastro({ onNavigate }: CadastroProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setMensagem('As senhas não coincidem');
      setSucesso(false);
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    if (usuarios.find((u: any) => u.email === email)) {
      setMensagem('Este email já está cadastrado');
      setSucesso(false);
      return;
    }

    const novoUsuario = {
      nome,
      email,
      cpfCnpj,
      telefone,
      senha,
      dataCadastro: new Date().toISOString()
    };

    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    setMensagem('Conta criada com sucesso! Redirecionando...');
    setSucesso(true);

    setTimeout(() => {
      onNavigate('login');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 p-12 flex-col justify-center items-center text-white">
        <div className="max-w-md">
          <h1 className="text-5xl mb-6">Gerencia.aí</h1>
          <p className="text-xl opacity-90">
            Crie sua conta e comece a organizar seu negócio de forma profissional.
          </p>
        </div>
      </div>

      {/* Lado direito */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="mb-2">Criar Conta</h2>
            <p className="text-muted-foreground">Preencha os campos abaixo para se cadastrar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                type="text"
                placeholder="Digite seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="bg-input-background border-border"
              />
            </div>

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
              <Label htmlFor="cpfCnpj">CPF ou CNPJ</Label>
              <Input
                id="cpfCnpj"
                type="text"
                placeholder="Digite seu CPF ou CNPJ"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(e.target.value)}
                required
                className="bg-input-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                type="tel"
                placeholder="(99) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
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
                  placeholder="Crie uma senha"
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

            <div className="space-y-2">
              <Label htmlFor="confirmarSenha">Confirmar senha</Label>
              <div className="relative">
                <Input
                  id="confirmarSenha"
                  type={showConfirmar ? 'text' : 'password'}
                  placeholder="Confirme sua senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  className="bg-input-background border-border pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmar(!showConfirmar)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmar ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Criar Conta
            </Button>
          </form>

          {mensagem && (
            <p className={`mt-4 text-center ${sucesso ? 'text-green-600' : 'text-destructive'}`}>
              {mensagem}
            </p>
          )}

          <div className="mt-6 flex items-center">
            <div className="flex-1 border-t border-border"></div>
            <span className="px-4 text-muted-foreground">ou</span>
            <div className="flex-1 border-t border-border"></div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate('login')}
              className="text-primary hover:underline"
            >
              Já tenho conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
