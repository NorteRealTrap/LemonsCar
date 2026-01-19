# Configuração do Banco de Dados Supabase

## Instruções

Para configurar o banco de dados do Lemon's Car, execute os comandos SQL abaixo no SQL Editor do Supabase:

### 1. Criar Tabela de Perfis

```sql
-- Criar tabela de perfis
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins podem ver todos os perfis
CREATE POLICY "Admins podem ver todos os perfis"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para novos usuários
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Criar Tabela de Agendamentos

```sql
-- Criar tabela de agendamentos
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  service_price TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  vehicle_model TEXT NOT NULL,
  vehicle_plate TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Usuários podem ver seus próprios agendamentos"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar agendamentos"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todos os agendamentos"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins podem atualizar agendamentos"
  ON bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 3. Criar Tabela de Pedidos/Pagamentos

```sql
-- Criar tabela de pedidos
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  booking_id UUID REFERENCES bookings(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
  payment_method TEXT NOT NULL,
  payment_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Usuários podem ver seus próprios pedidos"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar pedidos"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todos os pedidos"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 4. Criar Índices

```sql
-- Índices para melhor performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_booking_id ON orders(booking_id);
CREATE INDEX idx_orders_status ON orders(status);
```

### 5. Criar Primeiro Admin (Opcional)

```sql
-- Atualizar um usuário existente para admin
-- Substitua 'seu-email@example.com' pelo email do administrador
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@lemonscar.com.br';
```

## Observações Importantes

1. **Email Confirmation**: Por padrão, o Supabase requer confirmação de email. Para desenvolvimento, você pode desabilitar isso em:
   - Authentication > Settings > Enable email confirmations (desmarcar)

2. **Primeiro Usuário Admin**: 
   - Cadastre-se normalmente no site
   - Execute o comando SQL do passo 5 para tornar-se admin
   - Alternativamente, crie o usuário diretamente pelo código com `role: 'admin'`

3. **Segurança**:
   - As senhas são automaticamente hasheadas pelo Supabase
   - Row Level Security (RLS) está ativado em todas as tabelas
   - Dados de pagamento são apenas simulados (não processar dados reais de cartão)

4. **Para Produção**:
   - Configure um provedor de email no Supabase para confirmação de cadastros
   - Implemente gateway de pagamento real (Stripe, PayPal, etc.)
   - Adicione validações adicionais no backend
   - Configure backup automático dos dados

## Testando

Após executar os comandos SQL:

1. Acesse `/` e clique em "Entrar"
2. Crie uma conta de cliente
3. Faça um agendamento de teste
4. Veja o agendamento em `/dashboard`
5. Para acessar como admin, execute o comando do passo 5 e acesse `/admin`
