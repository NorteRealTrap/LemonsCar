import { useState } from 'react';
import { Lock, User } from 'lucide-react@0.487.0';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Autenticação simples (em produção, usar backend real)
    if (username === 'admin' && password === 'lemonscar2026') {
      localStorage.setItem('lemons-admin-auth', 'true');
      onLogin();
    } else {
      setError('Usuário ou senha incorretos');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-secondary border border-primary/20 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl text-white mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-400">Lemon's Car</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full bg-black border border-primary/20 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="Digite seu usuário"
                required
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
                className="w-full bg-black border border-primary/20 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="Digite sua senha"
                required
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
            className="w-full bg-primary text-black py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Credenciais padrão:</p>
          <p className="text-gray-400 mt-1">
            usuário: <span className="text-primary">admin</span> | senha: <span className="text-primary">lemonscar2026</span>
          </p>
        </div>
      </div>
    </div>
  );
}