import { Shield, Key, Settings, Package, Image as ImageIcon, ArrowRight } from 'lucide-react@0.487.0';

export function AdminGuide() {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-black border border-primary/20 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl text-white mb-2">🎉 Bem-vindo ao Painel Administrativo!</h3>
          <p className="text-gray-400">
            Gerencie todo o conteúdo do site da Lemon's Car de forma fácil e intuitiva.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-black/50 border border-primary/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-5 h-5 text-primary" />
            <h4 className="text-white">Credenciais de Acesso</h4>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-gray-400">Usuário: <span className="text-primary">admin</span></p>
            <p className="text-gray-400">Senha: <span className="text-primary">lemonscar2026</span></p>
          </div>
        </div>

        <div className="bg-black/50 border border-primary/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="w-5 h-5 text-primary" />
            <h4 className="text-white">Como Acessar</h4>
          </div>
          <p className="text-sm text-gray-400">
            Acesse: <span className="text-primary">/admin</span> na URL do site
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-white mb-2">Funcionalidades Disponíveis:</h4>
        
        <div className="flex items-start gap-3">
          <Package className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="text-white text-sm">Gerenciar Serviços</h5>
            <p className="text-xs text-gray-400">Adicione, edite ou remova serviços oferecidos</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ImageIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="text-white text-sm">Gerenciar Imagens</h5>
            <p className="text-xs text-gray-400">Faça upload e organize imagens da galeria</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Settings className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="text-white text-sm">Configurações do Site</h5>
            <p className="text-xs text-gray-400">Atualize informações de contato e horários</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-primary/20">
        <p className="text-xs text-gray-500">
          💡 <strong className="text-gray-400">Dica:</strong> Todas as alterações são salvas automaticamente no navegador. 
          Para persistência em produção, considere conectar ao Supabase.
        </p>
      </div>
    </div>
  );
}