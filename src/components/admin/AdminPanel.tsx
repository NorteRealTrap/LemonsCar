import { useState } from 'react';
import { Settings, Package, Image, LogOut, Menu, X, Home, BarChart3, Database } from 'lucide-react@0.487.0';
import { ServiceManager } from './ServiceManager';
import { SettingsManager } from './SettingsManager';
import { ImageManager } from './ImageManager';
import { AdminGuide } from './AdminGuide';
import { SetupGuide } from './SetupGuide';
import { useSiteData } from '../../contexts/SiteDataContext';

interface AdminPanelProps {
  onLogout: () => void;
}

type Tab = 'overview' | 'services' | 'images' | 'settings' | 'setup';

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const { services, images, settings } = useSiteData();

  const menuItems = [
    { id: 'overview' as Tab, name: 'Visão Geral', icon: BarChart3 },
    { id: 'services' as Tab, name: 'Serviços', icon: Package },
    { id: 'images' as Tab, name: 'Imagens', icon: Image },
    { id: 'settings' as Tab, name: 'Configurações', icon: Settings },
    { id: 'setup' as Tab, name: 'Setup Banco', icon: Database },
  ];

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-secondary border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-black text-xl">🍋</span>
              </div>
              <div>
                <h1 className="text-xl">Painel Administrativo</h1>
                <p className="text-sm text-gray-400">{settings.siteName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="/"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-primary hover:bg-primary/20 transition-all"
              >
                <Home className="w-4 h-4" />
                Ver Site
              </a>
              <button
                onClick={onLogout}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 bg-primary/10 border border-primary/20 rounded-lg text-primary"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className={`md:w-64 ${menuOpen ? 'block' : 'hidden md:block'}`}>
            <nav className="bg-secondary border border-primary/20 rounded-xl p-4 space-y-2 sticky top-24">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === item.id
                        ? 'bg-primary text-black'
                        : 'text-gray-400 hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </button>
                );
              })}

              <div className="pt-4 border-t border-primary/20 space-y-2">
                <a
                  href="/"
                  className="md:hidden w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <Home className="w-5 h-5" />
                  Ver Site
                </a>
                <button
                  onClick={onLogout}
                  className="md:hidden w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Sair
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl text-white">Visão Geral</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Package className="w-8 h-8 text-primary" />
                      <span className="text-3xl text-white">{services.length}</span>
                    </div>
                    <h3 className="text-gray-400 text-sm">Serviços Cadastrados</h3>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Image className="w-8 h-8 text-blue-400" />
                      <span className="text-3xl text-white">{images.length}</span>
                    </div>
                    <h3 className="text-gray-400 text-sm">Imagens na Galeria</h3>
                  </div>

                  <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Settings className="w-8 h-8 text-green-400" />
                      <span className="text-3xl text-white">✓</span>
                    </div>
                    <h3 className="text-gray-400 text-sm">Site Configurado</h3>
                  </div>
                </div>

                <div className="bg-secondary border border-primary/20 rounded-xl p-6">
                  <h3 className="text-xl text-white mb-4">Ações Rápidas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setActiveTab('services')}
                      className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-left hover:bg-primary/20 transition-all group"
                    >
                      <Package className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                      <h4 className="text-white mb-1">Gerenciar Serviços</h4>
                      <p className="text-sm text-gray-400">Adicionar ou editar serviços oferecidos</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('images')}
                      className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-left hover:bg-blue-500/20 transition-all group"
                    >
                      <Image className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                      <h4 className="text-white mb-1">Gerenciar Imagens</h4>
                      <p className="text-sm text-gray-400">Upload e organização de imagens</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('settings')}
                      className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-left hover:bg-green-500/20 transition-all group"
                    >
                      <Settings className="w-6 h-6 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                      <h4 className="text-white mb-1">Configurações</h4>
                      <p className="text-sm text-gray-400">Ajustar informações do site</p>
                    </button>

                    <a
                      href="/"
                      className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg text-left hover:bg-purple-500/20 transition-all group"
                    >
                      <Home className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                      <h4 className="text-white mb-1">Visualizar Site</h4>
                      <p className="text-sm text-gray-400">Ver como está ficando o site</p>
                    </a>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
                  <h3 className="text-white mb-3">📊 Status do Sistema</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Armazenamento</span>
                      <span className="text-green-400">● Local (localStorage)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Última atualização</span>
                      <span className="text-white">{new Date().toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && <ServiceManager />}
            {activeTab === 'images' && <ImageManager />}
            {activeTab === 'settings' && <SettingsManager />}
            {activeTab === 'setup' && <SetupGuide />}
          </main>
        </div>
      </div>
    </div>
  );
}