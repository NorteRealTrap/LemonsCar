import { Menu, X, User, LogIn } from 'lucide-react@0.487.0';
import { useState } from 'react';
import logo from 'figma:asset/eca4176b8d3b1a0c428ca7e1be088cc0422409ec.png';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from './auth/LoginModal';

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export function Header({ activeSection, onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { user, profile } = useAuth();

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Serviços' },
    { id: 'booking', label: 'Agenda' },
    { id: 'contact', label: 'Contato' },
  ];

  const handleNavigate = (section: string) => {
    onNavigate(section);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-primary/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => handleNavigate('home')}
              className="flex items-center gap-2 group"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden transform group-hover:scale-110 transition-transform duration-300 bg-white/10">
                <img src={logo} alt="Lemon's Car" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl text-primary tracking-tight">
                Lemon's Car
              </span>
            </button>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-primary text-black'
                      : 'text-white hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* User Menu */}
              {user && profile ? (
                <a
                  href="/dashboard"
                  className="flex items-center gap-2 ml-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-primary hover:bg-primary/20 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden lg:inline">{profile.full_name.split(' ')[0]}</span>
                </a>
              ) : (
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="flex items-center gap-2 ml-4 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Entrar
                </button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <nav className="md:hidden py-4 border-t border-primary/20 animate-fade-in">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full text-left px-4 py-3 transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-primary text-black'
                      : 'text-white hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Mobile User Menu */}
              <div className="mt-4 pt-4 border-t border-primary/20">
                {user && profile ? (
                  <a
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-3 text-primary hover:bg-primary/10"
                  >
                    <User className="w-5 h-5" />
                    {profile.full_name}
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      setLoginModalOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 bg-primary text-black rounded-lg"
                  >
                    <LogIn className="w-5 h-5" />
                    Entrar
                  </button>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </>
  );
}