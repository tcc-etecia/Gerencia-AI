import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import { AlertCircle, PackageCheck, PackageX } from 'lucide-react';

interface Produto {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
}

export default function Estoque() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    baixoEstoque: 0,
    semEstoque: 0,
    valorTotal: 0,
  });

  useEffect(() => {
    const produtosStorage = JSON.parse(localStorage.getItem('produtos') || '[]');
    setProdutos(produtosStorage);

    const total = produtosStorage.reduce((acc: number, p: any) => acc + p.quantidade, 0);
    const baixoEstoque = produtosStorage.filter((p: any) => p.quantidade > 0 && p.quantidade < 10).length;
    const semEstoque = produtosStorage.filter((p: any) => p.quantidade === 0).length;
    const valorTotal = produtosStorage.reduce((acc: number, p: any) => acc + (p.preco * p.quantidade), 0);

    setStats({ total, baixoEstoque, semEstoque, valorTotal });
  }, []);

  const getStatusColor = (quantidade: number) => {
    if (quantidade === 0) return 'text-red-600';
    if (quantidade < 10) return 'text-orange-600';
    return 'text-green-600';
  };

  const getStatusLabel = (quantidade: number) => {
    if (quantidade === 0) return 'Sem estoque';
    if (quantidade < 10) return 'Baixo estoque';
    return 'Disponível';
  };

  const getProgressValue = (quantidade: number) => {
    const max = 50; // Assumindo 50 como quantidade máxima ideal
    return Math.min((quantidade / max) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Controle de Estoque</h2>
        <p className="text-muted-foreground mt-1">
          Monitore o estoque de todos os seus produtos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Itens Totais
            </CardTitle>
            <PackageCheck className="text-blue-600" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              unidades em estoque
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Baixo Estoque
            </CardTitle>
            <AlertCircle className="text-orange-600" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.baixoEstoque}</div>
            <p className="text-xs text-muted-foreground mt-1">
              produtos precisam de atenção
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Sem Estoque
            </CardTitle>
            <PackageX className="text-red-600" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.semEstoque}</div>
            <p className="text-xs text-muted-foreground mt-1">
              produtos esgotados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Valor Total
            </CardTitle>
            <div className="text-green-600">R$</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">R$ {stats.valorTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              valor do estoque
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status Detalhado</CardTitle>
        </CardHeader>
        <CardContent>
          {produtos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum produto cadastrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Nível</TableHead>
                    <TableHead className="text-right">Valor em Estoque</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtos.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell>{produto.nome}</TableCell>
                      <TableCell className={getStatusColor(produto.quantidade)}>
                        {produto.quantidade}
                      </TableCell>
                      <TableCell>
                        <span className={getStatusColor(produto.quantidade)}>
                          {getStatusLabel(produto.quantidade)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="w-32">
                          <Progress 
                            value={getProgressValue(produto.quantidade)}
                            className="h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        R$ {(produto.preco * produto.quantidade).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {(stats.baixoEstoque > 0 || stats.semEstoque > 0) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">⚠️ Alertas de Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-orange-800">
              {stats.semEstoque > 0 && (
                <li>• {stats.semEstoque} produto(s) sem estoque - reabasteça urgentemente</li>
              )}
              {stats.baixoEstoque > 0 && (
                <li>• {stats.baixoEstoque} produto(s) com estoque baixo - planeje reposição</li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
