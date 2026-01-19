import { AlertTriangle, Database, X } from 'lucide-react@0.487.0';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function DatabaseWarning() {
  const { dbConfigured } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (dbConfigured || dismissed) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-full px-4 animate-fade-in">
      <div className="bg-gradient-to-r from-yellow-500/90 to-orange-500/90 backdrop-blur-sm border border-yellow-400/50 rounded-xl p-4 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
            <Database className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-white font-bold text-lg">Banco de Dados Não Configurado</h3>
              <button
                onClick={() => setDismissed(true)}
                className="p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <p className="text-white/90 text-sm mb-3">
              Para usar agendamentos e autenticação de clientes, você precisa configurar o banco de dados do Supabase.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <a
                href="/admin"
                className="inline-flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg hover:bg-white/90 transition-all text-sm font-semibold"
              >
                <Database className="w-4 h-4" />
                Configurar Agora
              </a>
              
              <button
                onClick={() => setDismissed(true)}
                className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all text-sm"
              >
                Continuar sem configurar
              </button>
            </div>
            
            <p className="text-white/70 text-xs mt-3">
              💡 O sistema funcionará em modo básico até a configuração ser concluída.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}