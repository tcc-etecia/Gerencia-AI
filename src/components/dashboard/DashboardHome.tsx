import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Package, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

interface DashboardHomeProps {
  usuario: any;
}

export default function DashboardHome({ usuario }: DashboardHomeProps) {
  const [stats, setStats] = useState({
    totalProdutos: 0,
    produtosBaixoEstoque: 0,
    totalReceber: 0,
    totalPagar: 0,
  });

  useEffect(() => {
    // Calcular estatísticas
    const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
    const financeiro = JSON.parse(localStorage.getItem('financeiro') || '[]');

    const totalProdutos = produtos.length;
    const produtosBaixoEstoque = produtos.filter((p: any) => p.quantidade < 10).length;
    const totalReceber = financeiro
      .filter((f: any) => f.tipo === 'receber')
      .reduce((acc: number, f: any) => acc + parseFloat(f.valor), 0);
    const totalPagar = financeiro
      .filter((f: any) => f.tipo === 'pagar')
      .reduce((acc: number, f: any) => acc + parseFloat(f.valor), 0);

    setStats({
      totalProdutos,
      produtosBaixoEstoque,
      totalReceber,
      totalPagar,
    });
  }, []);

  const cards = [
    {
      title: 'Total de Produtos',
      value: stats.totalProdutos,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Baixo Estoque',
      value: stats.produtosBaixoEstoque,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'A Receber',
      value: `R$ ${stats.totalReceber.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'A Pagar',
      value: `R$ ${stats.totalPagar.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2>Bem-vindo de volta, {usuario?.nome?.split(' ')[0] || 'Usuário'}!</h2>
        <p className="text-muted-foreground mt-1">
          Aqui está um resumo do seu negócio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={card.color} size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total a Receber</span>
                <span className="text-green-600">
                  R$ {stats.totalReceber.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total a Pagar</span>
                <span className="text-red-600">
                  R$ {stats.totalPagar.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span>Saldo</span>
                <span className={stats.totalReceber - stats.totalPagar >= 0 ? 'text-green-600' : 'text-red-600'}>
                  R$ {(stats.totalReceber - stats.totalPagar).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status do Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total de Produtos</span>
                <span>{stats.totalProdutos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Produtos em Baixo Estoque</span>
                <span className="text-orange-600">{stats.produtosBaixoEstoque}</span>
              </div>
              {stats.produtosBaixoEstoque > 0 && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    ⚠️ Você tem {stats.produtosBaixoEstoque} produto(s) com estoque baixo que precisam de atenção
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
