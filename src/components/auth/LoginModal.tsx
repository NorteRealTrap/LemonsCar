import { useState } from 'react';
import { X, Mail, Lock, User, Phone } from 'lucide-react@0.487.0';
import { useAuth } from '../../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export function LoginModal({ isOpen, onClose, defaultTab = 'login' }: LoginModalProps) {
  const [tab, setTab] = useState<'login' | 'signup'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await signIn(email, password);
        onClose();
        // Reset form
        setEmail('');
        setPassword('');
        setFullName('');
        setPhone('');
      } else {
        await signUp(email, password, fullName, phone);
        // Se chegou aqui, pode ter sido sucesso ou pode precisar confirmar email
        alert('Conta criada com sucesso! ' + (error ? 'Por favor, confirme seu email.' : 'Você já está logado!'));
        onClose();
        // Reset form
        setEmail('');
        setPassword('');
        setFullName('');
        setPhone('');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary border border-primary/20 rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-primary/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl text-white mb-2">
            {tab === 'login' ? 'Entrar na Conta' : 'Criar Conta'}
          </h2>
          <p className="text-gray-400">
            {tab === 'login' ? 'Acesse sua área do cliente' : 'Cadastre-se para agendar serviços'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-black rounded-lg p-1">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              tab === 'login'
                ? 'bg-primary text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              tab === 'signup'
                ? 'bg-primary text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Cadastrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'signup' && (
            <>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-black border border-primary/20 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black border border-primary/20 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-2">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-primary/20 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-primary/20 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Carregando...' : tab === 'login' ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        {tab === 'login' && (
          <p className="mt-4 text-center text-sm text-gray-400">
            Esqueceu sua senha?{' '}
            <button className="text-primary hover:underline">
              Recuperar
            </button>
          </p>
        )}
      </div>
    </div>
  );
}