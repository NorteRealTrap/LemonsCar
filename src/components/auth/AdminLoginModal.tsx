import { useState } from 'react';
import { X, Lock, User, AlertCircle } from 'lucide-react@0.487.0';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simular delay de autenticação
    setTimeout(() => {
      // Credenciais padrão (em produção, usar Supabase Auth)
      if (username === 'admin' && password === 'lemonscar2026') {
        localStorage.setItem('lemons-admin-auth', 'true');
        window.location.href = '/admin';
      } else {
        setError('Usuário ou senha incorretos');
        setLoading(false);
      }
    }, 500);
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="max-w-md w-full bg-secondary border border-primary/20 rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-white">Painel Admin</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <p className="text-gray-400 mb-6">
          Acesse o painel administrativo da Lemon's Car
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Usuário
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-primary/20 rounded-lg pl-11 pr-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="admin"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-primary/20 rounded-lg pl-11 pr-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black py-2 rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-blue-300">
            <strong>Credenciais padrão:</strong><br/>
            Usuário: <span className="font-mono">admin</span><br/>
            Senha: <span className="font-mono">lemonscar2026</span>
          </p>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Use o painel administrativo para gerenciar serviços, imagens e configurações do site.
        </p>
      </div>
    </div>
  );
}
