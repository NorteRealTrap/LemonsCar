# 🔐 Login Administrativo - Guia Completo

## 📍 Como Acessar o Painel Admin

### **Via Website**

1. **Desktop**: Clique no ícone **🛡️** (escudo) na barra de navegação (canto superior direito)
2. **Mobile**: Abra o menu (≡), role até o final e clique em **"Painel Admin"**
3. Uma modal de login aparecerá

### **Credenciais Padrão**

```
Usuário: admin
Senha: lemonscar2026
```

### **Acesso Direto**

Você também pode acessar diretamente em:
```
https://lemonscar.com.br/admin
```

---

## 🔑 Alterando a Senha (IMPORTANTE!)

**Em Produção**, você DEVE alterar a senha padrão. Para fazer isso:

### Opção 1: Usar Supabase Auth (Recomendado)

```typescript
// Modificar src/components/auth/AdminLoginModal.tsx
// Substituir a validação hardcoded por Supabase Auth:

import { supabase } from '../../utils/supabase/client';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username, // usar como email
      password: password,
    });

    if (error) throw error;

    // Verificar se é admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profile?.role === 'admin') {
      localStorage.setItem('lemons-admin-auth', 'true');
      window.location.href = '/admin';
    } else {
      setError('Você não tem permissão de administrador');
    }
  } catch (error: any) {
    setError(error.message);
  }
};
```

### Opção 2: Alterar Localmente

Se usar a autenticação local (desenvolvimento), edite:

**Arquivo:** `src/components/auth/AdminLoginModal.tsx` (linha ~55)

```typescript
if (username === 'NOVO_USUARIO' && password === 'NOVA_SENHA') {
  // Login bem-sucedido
}
```

---

## 📋 O Que o Admin Pode Fazer

### **1. Painel de Visão Geral**
- 📊 Ver estatísticas do site
- 📅 Ver agendamentos recentes
- 💰 Ver pagamentos processados

### **2. Gerenciar Serviços**
- ✏️ Editar serviços existentes
- ➕ Criar novos serviços
- 🗑️ Deletar serviços
- 💵 Atualizar preços

### **3. Gerenciar Imagens**
- 📸 Fazer upload de imagens (até 5MB)
- 🏷️ Categorizar por tipo (hero, service, gallery, logo)
- 🗑️ Deletar imagens desnecessárias
- 📊 Ver tamanho e data de upload

### **4. Configurações do Site**
- 🏢 Nome da empresa
- 📱 Telefone/WhatsApp
- 📧 Email de contato
- 🕐 Horário de funcionamento
- 📍 Endereço
- 🔗 Links de redes sociais

### **5. Setup do Banco de Dados**
- 📚 Executar scripts SQL
- 🔄 Sincronizar com Supabase
- 🛠️ Manutenção do banco

---

## 🚨 Segurança

### ⚠️ NUNCA compartilhe as credenciais!

Se precisar de mais admins:

1. **Criar usuário no Supabase** (recomendado)
   ```sql
   -- No painel Supabase
   Autenticação → Usuários → Adicionar novo
   ```

2. **Definir role como 'admin'**
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE email = 'novo-admin@lemonscar.com.br';
   ```

### 🔒 Boas Práticas

- ✅ Alterar senha em produção
- ✅ Usar Supabase Auth com email e senha segura
- ✅ Habilitar autenticação de dois fatores (2FA)
- ✅ Monitorar acessos
- ✅ Usar roles de usuário (admin, editor, viewer)

---

## 🐛 Troubleshooting

### "Usuário ou senha incorretos"
- ✓ Verifique se está usando `admin` e `lemonscar2026`
- ✓ Verifique se não há espaços em branco
- ✓ Tente novamente ou limpe o cache do navegador

### "Erro ao acessar /admin"
- ✓ Verifique se está logado (localStorage)
- ✓ Tente acessar novamente pelo botão no header
- ✓ Verifique o console (F12) para mais detalhes

### Esqueceu a Senha
- Para reset, execute no console do navegador:
  ```javascript
  localStorage.removeItem('lemons-admin-auth');
  window.location.href = '/';
  ```

---

## 📊 Estrutura de Permissões (Futura)

```typescript
// Roles propostos:
- 'admin'    → Acesso total
- 'editor'   → Editar serviços e imagens
- 'viewer'   → Apenas visualizar
- 'client'   → Cliente normal
```

---

## 🔧 Migrar para Supabase Auth

Para maior segurança em produção:

```bash
# 1. Ir ao painel Supabase
# 2. Authentication → Users
# 3. Criar novo usuário admin com email
# 4. Dar role 'admin' na tabela profiles
# 5. Implementar validação conforme Opção 1 acima
```

---

## 📚 Referências

- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Controle de Acesso Baseado em Roles (RBAC)](https://supabase.com/docs/guides/auth/row-level-security)
- [Autenticação 2FA no Supabase](https://supabase.com/docs/guides/auth/auth-mfa)

