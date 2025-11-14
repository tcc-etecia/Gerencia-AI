import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Download, TrendingUp, Package, DollarSign } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/chart';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function Relatorios() {
  const [dadosRelatorio, setDadosRelatorio] = useState({
    produtos: [] as any[],
    movimentacoes: [] as any[],
    totalProdutos: 0,
    valorEstoque: 0,
    totalReceber: 0,
    totalPagar: 0,
  });

  useEffect(() => {
    const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
    const movimentacoes = JSON.parse(localStorage.getItem('financeiro') || '[]');

    const totalProdutos = produtos.length;
    const valorEstoque = produtos.reduce((acc: number, p: any) => acc + (p.preco * p.quantidade), 0);
    const totalReceber = movimentacoes
      .filter((m: any) => m.tipo === 'receber')
      .reduce((acc: number, m: any) => acc + m.valor, 0);
    const totalPagar = movimentacoes
      .filter((m: any) => m.tipo === 'pagar')
      .reduce((acc: number, m: any) => acc + m.valor, 0);

    setDadosRelatorio({
      produtos,
      movimentacoes,
      totalProdutos,
      valorEstoque,
      totalReceber,
      totalPagar,
    });
  }, []);

  const exportarCSV = () => {
    const { produtos, movimentacoes } = dadosRelatorio;
    
    let csv = 'RELATÓRIO GERAL - GERENCIA.AÍ\n\n';
    
    csv += 'PRODUTOS\n';
    csv += 'Nome,Preço,Quantidade,Valor Total\n';
    produtos.forEach((p: any) => {
      csv += `${p.nome},${p.preco},${p.quantidade},${(p.preco * p.quantidade).toFixed(2)}\n`;
    });
    
    csv += '\n\nMOVIMENTAÇÕES FINANCEIRAS\n';
    csv += 'Descrição,Tipo,Valor,Data\n';
    movimentacoes.forEach((m: any) => {
      csv += `${m.descricao},${m.tipo},${m.valor},${new Date(m.data).toLocaleDateString('pt-BR')}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Relatório exportado com sucesso!');
  };

  // Preparar dados para o gráfico
  const dadosGrafico = [
    {
      name: 'Produtos',
      valor: dadosRelatorio.totalProdutos,
    },
    {
      name: 'Estoque (R$)',
      valor: Math.round(dadosRelatorio.valorEstoque),
    },
    {
      name: 'A Receber',
      valor: Math.round(dadosRelatorio.totalReceber),
    },
    {
      name: 'A Pagar',
      valor: Math.round(dadosRelatorio.totalPagar),
    },
  ];

  const chartConfig = {
    valor: {
      label: 'Valor',
      color: 'hsl(var(--chart-1))',
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Relatórios</h2>
          <p className="text-muted-foreground mt-1">
            Visão geral e exportação de dados
          </p>
        </div>
        <Button onClick={exportarCSV} className="gap-2">
          <Download size={20} />
          Exportar CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total de Produtos
            </CardTitle>
            <Package className="text-blue-600" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{dadosRelatorio.totalProdutos}</div>
            <p className="text-xs text-muted-foreground mt-1">
              produtos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Valor em Estoque
            </CardTitle>
            <TrendingUp className="text-purple-600" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">R$ {dadosRelatorio.valorEstoque.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              valor total em produtos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              A Receber
            </CardTitle>
            <DollarSign className="text-green-600" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">
              R$ {dadosRelatorio.totalReceber.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              contas a receber
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              A Pagar
            </CardTitle>
            <DollarSign className="text-red-600" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-600">
              R$ {dadosRelatorio.totalPagar.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              contas a pagar
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visão Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="valor" fill="var(--color-valor)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            {dadosRelatorio.produtos.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhum produto cadastrado
              </p>
            ) : (
              <div className="space-y-3">
                {dadosRelatorio.produtos.slice(0, 5).map((produto: any) => (
                  <div key={produto.id} className="flex justify-between items-center border-b border-border pb-2">
                    <div>
                      <p>{produto.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        Qtd: {produto.quantidade}
                      </p>
                    </div>
                    <div className="text-right">
                      <p>R$ {produto.preco.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        Total: R$ {(produto.preco * produto.quantidade).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                {dadosRelatorio.produtos.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    + {dadosRelatorio.produtos.length - 5} produtos
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movimentações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {dadosRelatorio.movimentacoes.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma movimentação registrada
              </p>
            ) : (
              <div className="space-y-3">
                {dadosRelatorio.movimentacoes.slice(0, 5).map((mov: any) => (
                  <div key={mov.id} className="flex justify-between items-center border-b border-border pb-2">
                    <div>
                      <p>{mov.descricao}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(mov.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className={mov.tipo === 'receber' ? 'text-green-600' : 'text-red-600'}>
                      {mov.tipo === 'receber' ? '+' : '-'} R$ {mov.valor.toFixed(2)}
                    </div>
                  </div>
                ))}
                {dadosRelatorio.movimentacoes.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    + {dadosRelatorio.movimentacoes.length - 5} movimentações
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
