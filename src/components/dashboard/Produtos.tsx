import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Produto {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
}

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [filtro, setFiltro] = useState('');
  const [editando, setEditando] = useState<string | null>(null);

  useEffect(() => {
    const produtosStorage = JSON.parse(localStorage.getItem('produtos') || '[]');
    setProdutos(produtosStorage);
  }, []);

  const salvarProdutos = (novosProdutos: Produto[]) => {
    localStorage.setItem('produtos', JSON.stringify(novosProdutos));
    setProdutos(novosProdutos);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editando) {
      const produtosAtualizados = produtos.map(p =>
        p.id === editando
          ? { ...p, nome, preco: parseFloat(preco), quantidade: parseInt(quantidade) }
          : p
      );
      salvarProdutos(produtosAtualizados);
      toast.success('Produto atualizado com sucesso!');
      setEditando(null);
    } else {
      const novoProduto: Produto = {
        id: Date.now().toString(),
        nome,
        preco: parseFloat(preco),
        quantidade: parseInt(quantidade),
      };
      salvarProdutos([...produtos, novoProduto]);
      toast.success('Produto cadastrado com sucesso!');
    }

    setNome('');
    setPreco('');
    setQuantidade('');
  };

  const handleEditar = (produto: Produto) => {
    setNome(produto.nome);
    setPreco(produto.preco.toString());
    setQuantidade(produto.quantidade.toString());
    setEditando(produto.id);
  };

  const handleDeletar = (id: string) => {
    const produtosAtualizados = produtos.filter(p => p.id !== id);
    salvarProdutos(produtosAtualizados);
    toast.success('Produto deletado com sucesso!');
  };

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2>Gestão de Produtos</h2>
        <p className="text-muted-foreground mt-1">
          Cadastre e gerencie seus produtos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>
              {editando ? 'Editar Produto' : 'Cadastrar Produto'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Notebook Dell"
                  required
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preco">Preço (R$)</Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  placeholder="0.00"
                  required
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  placeholder="0"
                  required
                  className="bg-input-background"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editando ? 'Atualizar' : 'Cadastrar'}
                </Button>
                {editando && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditando(null);
                      setNome('');
                      setPreco('');
                      setQuantidade('');
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Lista de Produtos</CardTitle>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                placeholder="Buscar produto..."
                className="pl-10 bg-input-background"
              />
            </div>
          </CardHeader>
          <CardContent>
            {produtosFiltrados.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {filtro ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtosFiltrados.map((produto) => (
                      <TableRow key={produto.id}>
                        <TableCell>{produto.nome}</TableCell>
                        <TableCell>R$ {produto.preco.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={produto.quantidade < 10 ? 'text-orange-600' : ''}>
                            {produto.quantidade}
                            {produto.quantidade < 10 && ' ⚠️'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditar(produto)}
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeletar(produto.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
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
