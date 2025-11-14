import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Movimentacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'receber' | 'pagar';
  data: string;
}

export default function Financeiro() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<'receber' | 'pagar'>('receber');

  useEffect(() => {
    const financeiroStorage = JSON.parse(localStorage.getItem('financeiro') || '[]');
    setMovimentacoes(financeiroStorage);
  }, []);

  const salvarMovimentacoes = (novasMovimentacoes: Movimentacao[]) => {
    localStorage.setItem('financeiro', JSON.stringify(novasMovimentacoes));
    setMovimentacoes(novasMovimentacoes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const novaMovimentacao: Movimentacao = {
      id: Date.now().toString(),
      descricao,
      valor: parseFloat(valor),
      tipo,
      data: new Date().toISOString(),
    };

    salvarMovimentacoes([...movimentacoes, novaMovimentacao]);
    toast.success('Movimentação adicionada com sucesso!');

    setDescricao('');
    setValor('');
    setTipo('receber');
  };

  const handleDeletar = (id: string) => {
    const movimentacoesAtualizadas = movimentacoes.filter(m => m.id !== id);
    salvarMovimentacoes(movimentacoesAtualizadas);
    toast.success('Movimentação deletada com sucesso!');
  };

  const totalReceber = movimentacoes
    .filter(m => m.tipo === 'receber')
    .reduce((acc, m) => acc + m.valor, 0);

  const totalPagar = movimentacoes
    .filter(m => m.tipo === 'pagar')
    .reduce((acc, m) => acc + m.valor, 0);

  const saldo = totalReceber - totalPagar;

  return (
    <div className="space-y-6">
      <div>
        <h2>Gestão Financeira</h2>
        <p className="text-muted-foreground mt-1">
          Controle de contas a receber e a pagar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              A Receber
            </CardTitle>
            <TrendingUp className="text-green-600" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">
              R$ {totalReceber.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              A Pagar
            </CardTitle>
            <TrendingDown className="text-red-600" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-600">
              R$ {totalPagar.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Saldo
            </CardTitle>
            <DollarSign className={saldo >= 0 ? 'text-green-600' : 'text-red-600'} size={20} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {saldo.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Nova Movimentação</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Venda de produto"
                  required
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="0.00"
                  required
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={tipo} onValueChange={(value: 'receber' | 'pagar') => setTipo(value)}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receber">A Receber</SelectItem>
                    <SelectItem value="pagar">A Pagar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                Adicionar
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Movimentações</CardTitle>
          </CardHeader>
          <CardContent>
            {movimentacoes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma movimentação cadastrada
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movimentacoes.map((mov) => (
                      <TableRow key={mov.id}>
                        <TableCell>{mov.descricao}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1 ${
                            mov.tipo === 'receber' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {mov.tipo === 'receber' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            {mov.tipo === 'receber' ? 'Receber' : 'Pagar'}
                          </span>
                        </TableCell>
                        <TableCell className={mov.tipo === 'receber' ? 'text-green-600' : 'text-red-600'}>
                          R$ {mov.valor.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {new Date(mov.data).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeletar(mov.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
