import { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  BarChart3, 
  DollarSign, 
  FileText, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import DashboardHome from './dashboard/DashboardHome';
import Produtos from './dashboard/Produtos';
import Estoque from './dashboard/Estoque';
import Financeiro from './dashboard/Financeiro';
import Relatorios from './dashboard/Relatorios';

interface DashboardProps {
  usuario: any;
  onLogout: () => void;
}

type Section = 'home' | 'produtos' | 'estoque' | 'financeiro' | 'relatorios';

export default function Dashboard({ usuario, onLogout }: DashboardProps) {
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'home' as Section, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'produtos' as Section, label: 'Produtos', icon: Package },
    { id: 'estoque' as Section, label: 'Estoque', icon: BarChart3 },
    { id: 'financeiro' as Section, label: 'Financeiro', icon: DollarSign },
    { id: 'relatorios' as Section, label: 'Relatórios', icon: FileText },
  ];

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <DashboardHome usuario={usuario} />;
      case 'produtos':
        return <Produtos />;
      case 'estoque':
        return <Estoque />;
      case 'financeiro':
        return <Financeiro />;
      case 'relatorios':
        return <Relatorios />;
      default:
        return <DashboardHome usuario={usuario} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden`}
      >
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-sidebar-foreground">Gerencia.aí</h1>
          <p className="text-sm text-sidebar-foreground/60 mt-1">
            {usuario?.nome || 'Usuário'}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full justify-start gap-3"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
