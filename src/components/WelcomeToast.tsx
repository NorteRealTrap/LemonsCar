import { useEffect, useState } from 'react';
import { X, Sparkles, ExternalLink } from 'lucide-react@0.487.0';

export function WelcomeToast() {
  const [show, setShow] = useState(false);
  const STORAGE_KEY = 'lemons-welcome-shown';

  useEffect(() => {
    const hasShown = localStorage.getItem(STORAGE_KEY);
    if (!hasShown) {
      // Mostrar após 2 segundos
      setTimeout(() => {
        setShow(true);
      }, 2000);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm animate-fade-in">
      <div className="bg-gradient-to-br from-primary/95 to-yellow-600/95 backdrop-blur-sm rounded-xl shadow-2xl border border-yellow-400/50 p-5">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-white font-bold text-lg">Bem-vindo! 🍋</h3>
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            
            <p className="text-white/90 text-sm mb-3">
              Sistema completo de gestão automotiva. Configure o banco de dados para ativar todas as funcionalidades!
            </p>
            
            <div className="flex flex-wrap gap-2">
              <a
                href="/admin"
                className="inline-flex items-center gap-1 bg-white text-yellow-700 px-3 py-1.5 rounded-lg hover:bg-white/90 transition-all text-xs font-semibold"
              >
                <ExternalLink className="w-3 h-3" />
                Configurar
              </a>
              
              <button
                onClick={handleDismiss}
                className="inline-flex items-center gap-1 bg-white/20 text-white px-3 py-1.5 rounded-lg hover:bg-white/30 transition-all text-xs"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}