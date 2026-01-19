import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeSection } from './components/HomeSection';
import { ServicesSection, Service } from './components/ServicesSection';
import { BookingSection } from './components/BookingSection_New';
import { ContactSection } from './components/ContactSection';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminPanel } from './components/admin/AdminPanel';
import { ClientDashboard } from './components/client/ClientDashboard';
import { SiteDataProvider } from './contexts/SiteDataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WhatsAppButton } from './components/WhatsAppButton';
import { DatabaseWarning } from './components/DatabaseWarning';
import { WelcomeToast } from './components/WelcomeToast';
import { Toaster } from 'sonner@2.0.3';

function AppContent() {
  const [activeSection, setActiveSection] = useState('home');
  const [preSelectedService, setPreSelectedService] = useState<Service | undefined>();
  const [routeChecked, setRouteChecked] = useState(false);
  const { user, profile, loading } = useAuth();

  // Verificar rota e autenticação
  useEffect(() => {
    setRouteChecked(true);
  }, []);

  // Log do painel admin no console
  useEffect(() => {
    console.log(
      '%c🍋 Lemon\'s Car - Sistema Completo',
      'color: #FFD700; font-size: 20px; font-weight: bold; background: #000; padding: 10px;'
    );
    console.log(
      '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'color: #FFD700;'
    );
    console.log(
      '%c📍 URLs Principais',
      'color: #FFD700; font-size: 16px; font-weight: bold;'
    );
    console.log(
      '%c  → Site Principal: /',
      'color: #fff; font-size: 14px;'
    );
    console.log(
      '%c  → Painel Admin: /admin (admin / lemonscar2026)',
      'color: #fff; font-size: 14px;'
    );
    console.log(
      '%c  → Área do Cliente: /dashboard',
      'color: #fff; font-size: 14px;'
    );
    console.log(
      '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'color: #FFD700;'
    );
    console.log(
      '%c📚 Documentação',
      'color: #FFD700; font-size: 16px; font-weight: bold;'
    );
    console.log(
      '%c  → Início Rápido: /INICIO_RAPIDO.md',
      'color: #fff; font-size: 14px;'
    );
    console.log(
      '%c  → Erros Comuns: /ERROS_COMUNS.md',
      'color: #fff; font-size: 14px;'
    );
    console.log(
      '%c  → Guia Completo: /GUIA_COMPLETO.md',
      'color: #fff; font-size: 14px;'
    );
    console.log(
      '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'color: #FFD700;'
    );
    console.log(
      '%c⚡ Configure o banco de dados em /admin → Setup Banco',
      'color: #FFA500; font-size: 14px; font-weight: bold;'
    );
    console.log(
      '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'color: #FFD700;'
    );
  }, []);

  // Scroll to section quando a navegação mudar
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/' || path === '') {
      const element = document.getElementById(activeSection);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [activeSection]);

  const handleServiceSelect = (service: Service) => {
    setPreSelectedService(service);
    setActiveSection('booking');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('lemons-admin-auth');
    window.location.href = '/';
  };

  if (loading || !routeChecked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  const path = window.location.pathname;

  // Painel Admin (sistema antigo com localStorage)
  if (path === '/admin' || path.startsWith('/admin/')) {
    const isAuthenticated = localStorage.getItem('lemons-admin-auth') === 'true';
    
    return isAuthenticated ? (
      <AdminPanel onLogout={handleAdminLogout} />
    ) : (
      <AdminLogin onLogin={() => window.location.reload()} />
    );
  }

  // Dashboard do Cliente
  if (path === '/dashboard' || path.startsWith('/dashboard/')) {
    if (!user) {
      // Redirecionar para home se não estiver logado
      window.location.href = '/';
      return null;
    }
    
    return <ClientDashboard />;
  }

  // Site principal
  return (
    <div className="min-h-screen bg-black text-white">
      <Header activeSection={activeSection} onNavigate={setActiveSection} />
      <DatabaseWarning />
      
      <main>
        <div id="home">
          <HomeSection />
        </div>
        
        <div id="services">
          <ServicesSection onSelectService={handleServiceSelect} />
        </div>
        
        <div id="booking">
          <BookingSection preSelectedService={preSelectedService} />
        </div>
        
        <div id="contact">
          <ContactSection />
        </div>
      </main>

      <WhatsAppButton />
      <WelcomeToast />
      <Toaster position="top-right" theme="dark" richColors />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SiteDataProvider>
        <AppContent />
      </SiteDataProvider>
    </AuthProvider>
  );
}