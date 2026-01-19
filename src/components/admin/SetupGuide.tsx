import { Database, CheckCircle2, AlertCircle, Copy } from 'lucide-react@0.487.0';
import { useState } from 'react';

export function SetupGuide() {
  const [copied, setCopied] = useState(false);

  const sqlScript = `-- Execute este script no SQL Editor do Supabase

-- 1. Criar Tabela de Perfis
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON profiles FOR SELECT USING (auth.uid() = id);

-- 2. Criar Tabela de Agendamentos
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  service_price TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  vehicle_model TEXT NOT NULL,
  vehicle_plate TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus agendamentos"
  ON bookings FOR SELECT USING (auth.uid() = user_id);

-- 3. Criar Tabela de Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  booking_id UUID REFERENCES bookings(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL,
  payment_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus pedidos"
  ON orders FOR SELECT USING (auth.uid() = user_id);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <Database className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h2 className="text-2xl text-white mb-2">Configuração do Banco de Dados</h2>
            <p className="text-gray-400 mb-4">
              Para usar o sistema completo de autenticação, agendamentos e pagamentos, você precisa configurar o banco de dados do Supabase.
            </p>
          </div>
        </div>
      </div>

      {/* Passo a Passo */}
      <div className="space-y-4">
        <div className="bg-secondary border border-primary/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold">1</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">Acesse o Supabase Dashboard</h3>
              <p className="text-gray-400 text-sm mb-2">
                Abra o <strong>SQL Editor</strong> no painel do Supabase
              </p>
              <a
                href="https://app.supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                → Abrir Supabase Dashboard
              </a>
            </div>
          </div>
        </div>

        <div className="bg-secondary border border-primary/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold">2</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">Execute o Script SQL</h3>
              <p className="text-gray-400 text-sm mb-3">
                Copie e execute este script no SQL Editor:
              </p>
              
              <div className="bg-black border border-primary/20 rounded-lg p-4 relative">
                <button
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-primary" />
                  )}
                </button>
                <pre className="text-xs text-gray-300 overflow-x-auto max-h-64 pr-12">
                  {sqlScript}
                </pre>
              </div>
              
              {copied && (
                <p className="text-green-400 text-sm mt-2">✓ Script copiado!</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-secondary border border-primary/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold">3</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">Configure Autenticação</h3>
              <p className="text-gray-400 text-sm mb-2">
                <strong className="text-red-400">IMPORTANTE:</strong> Para desenvolvimento, desabilite a confirmação de email:
              </p>
              <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside mb-3">
                <li>Vá em <strong className="text-white">Authentication → Settings</strong></li>
                <li>Desmarque <strong className="text-white">"Enable email confirmations"</strong></li>
                <li>Isso permite criar contas sem verificar email</li>
                <li><strong className="text-red-400">Sem isso, você terá erro "Email not confirmed"</strong></li>
              </ul>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-yellow-400 text-sm">
                  ⚠️ Se você não desabilitar a confirmação de email, precisará configurar um provedor de email (SMTP, SendGrid, etc.) para que os usuários possam confirmar suas contas.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary border border-primary/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold">4</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">Crie seu Primeiro Admin</h3>
              <p className="text-gray-400 text-sm mb-2">
                Após criar uma conta no site, execute no SQL Editor:
              </p>
              <div className="bg-black border border-primary/20 rounded-lg p-3">
                <code className="text-xs text-primary">
                  UPDATE profiles SET role = 'admin' WHERE email = 'seu-email@exemplo.com';
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avisos */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <h4 className="text-blue-400 mb-1">Informações Importantes</h4>
            <ul className="text-gray-400 space-y-1">
              <li>• O script cria as tabelas com Row Level Security (RLS) ativado</li>
              <li>• Cada usuário só pode ver seus próprios dados</li>
              <li>• Admins têm acesso a todos os dados</li>
              <li>• Para produção, configure um gateway de pagamento real</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <h4 className="text-green-400 mb-1">Funcionalidades Disponíveis</h4>
            <ul className="text-gray-400 space-y-1">
              <li>✓ Cadastro e login de clientes</li>
              <li>✓ Agendamento de serviços com checkout</li>
              <li>✓ Área do cliente com histórico</li>
              <li>✓ Painel administrativo completo</li>
              <li>✓ Múltiplos métodos de pagamento (simulados)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}