# 🍋 Lemon's Car - Sistema Completo

Sistema completo de gerenciamento para lavagem e estética automotiva com checkout, autenticação de usuários e painel administrativo.

## 📋 Funcionalidades

### Para Clientes
- ✅ Cadastro e login de usuários
- ✅ Navegação pelo site com todas as seções
- ✅ Visualização de serviços disponíveis
- ✅ Sistema de agendamento interativo
- ✅ Checkout com múltiplos métodos de pagamento:
  - PIX (5% desconto)
  - Cartão de Crédito (parcelamento em até 6x)
  - Cartão de Débito (3% desconto)
  - Dinheiro (10% desconto - pagamento no local)
- ✅ Área do cliente com:
  - Perfil pessoal
  - Histórico de agendamentos
  - Histórico de pedidos/pagamentos

### Para Administradores
- ✅ Painel administrativo completo
- ✅ Gerenciamento de serviços (CRUD completo)
- ✅ Gerenciamento de imagens
- ✅ Configurações do site (contatos, horários, etc.)
- ✅ Visualização de todos os agendamentos
- ✅ Sistema de autenticação separado

## 🚀 Como Usar

### Acessos

**Site Principal**
- URL: `/`
- Navegação livre
- Login de clientes disponível no header

**Área do Cliente**
- URL: `/dashboard`
- Requer login de cliente
- Mostra perfil e histórico

**Painel Administrativo**
- URL: `/admin`
- Credenciais padrão:
  - Usuário: `admin`
  - Senha: `lemonscar2026`

### Configuração Inicial

#### 1. Configurar Banco de Dados (Necessário para produção)

O sistema usa Supabase para autenticação e armazenamento de dados.

**Passo 1:** Acesse o Supabase Dashboard
- Vá para: https://app.supabase.com
- Selecione seu projeto
- Abra o **SQL Editor**

**Passo 2:** Execute o script de setup
- Copie o conteúdo de `/supabase/migrations/001_initial_setup.sql`
- Cole no SQL Editor
- Execute o script

Alternativamente, acesse `/admin` → Tab "Setup Banco" para instruções passo a passo.

**Passo 3:** Configure autenticação (opcional para dev)
- Vá em Authentication → Settings
- Desmarque "Enable email confirmations" para desenvolvimento
- Isso permite criar contas sem verificar email

**Passo 4:** Crie seu primeiro admin
Após criar uma conta normal no site, execute no SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'seu-email@exemplo.com';
```

#### 2. Cadastrar Serviços Iniciais

**Via Painel Admin:**
1. Acesse `/admin`
2. Faça login
3. Vá em "Serviços"
4. Clique em "Novo Serviço"
5. Preencha os dados e salve

**Serviços Padrão:**
O sistema já vem com 3 serviços pré-cadastrados:
- Lavagem Completa - R$ 150,00
- Polimento - R$ 350,00
- Manutenção Expressa - R$ 80,00

## 🎨 Personalização

### Cores do Tema
O site usa as cores corporativas da Lemon's Car:
- **Primária (Amarelo):** #FFD700
- **Secundária (Preto):** #000000

### Alterar Informações de Contato
1. Acesse `/admin`
2. Vá em "Configurações"
3. Edite:
   - Nome do site
   - Endereço
   - WhatsApp
   - Instagram
   - Email
   - Horário de funcionamento

### Adicionar Imagens
1. Acesse `/admin`
2. Vá em "Imagens"
3. Clique em "Upload de Imagens"
4. Selecione as imagens desejadas

**Nota:** Atualmente as imagens são armazenadas localmente. Para produção, configure o Supabase Storage.

## 💳 Sistema de Pagamentos

### Métodos Disponíveis

**PIX**
- Desconto: 5%
- QR Code gerado automaticamente (simulado)
- Confirmação instantânea

**Cartão de Crédito**
- Parcelamento em até 6x sem juros
- Campos: número, nome, validade, CVV
- Validação básica de campos

**Cartão de Débito**
- Desconto: 3%
- Aprovação rápida
- Mesmos campos do crédito

**Dinheiro**
- Desconto: 10%
- Pagamento no local
- Status fica como "pendente" até confirmação manual

### ⚠️ Importante sobre Pagamentos

**ESTE É UM SISTEMA DE DEMONSTRAÇÃO**

Os pagamentos são **simulados** e **não processam transações reais**. 

Para produção real:
1. Integre com um gateway de pagamento:
   - Stripe
   - PagSeguro
   - Mercado Pago
   - PayPal
   
2. Nunca armazene dados completos de cartão
3. Use PCI-DSS compliance
4. Implemente webhooks para confirmação
5. Configure SSL/HTTPS obrigatório

## 📱 Responsividade

O site é 100% responsivo e otimizado para:
- 📱 Smartphones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1440px+)

Recursos mobile:
- Menu hambúrguer
- Touch-friendly buttons
- Otimização de imagens
- Swipe gestures (onde aplicável)

## 🔐 Segurança

### Autenticação
- Senhas hasheadas automaticamente pelo Supabase
- JWT tokens para sessões
- Row Level Security (RLS) no banco de dados
- Cada usuário só vê seus próprios dados

### Permissões
- **Cliente:** Pode ver apenas seus agendamentos e pedidos
- **Admin:** Acesso total ao painel administrativo

### Recomendações para Produção
1. Ative confirmação de email
2. Implemente rate limiting
3. Configure CORS adequadamente
4. Use HTTPS obrigatório
5. Monitore logs de acesso
6. Implemente 2FA para admins

## 📊 Estrutura do Banco de Dados

### Tabela: `profiles`
```sql
- id (UUID) - FK para auth.users
- email (TEXT)
- full_name (TEXT)
- phone (TEXT)
- role (TEXT) - 'client' ou 'admin'
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tabela: `bookings`
```sql
- id (UUID)
- user_id (UUID) - FK para auth.users
- service_id (TEXT)
- service_name (TEXT)
- service_price (TEXT)
- date (DATE)
- time (TIME)
- status (TEXT) - pending, confirmed, completed, cancelled
- vehicle_model (TEXT)
- vehicle_plate (TEXT)
- notes (TEXT)
- created_at (TIMESTAMP)
```

### Tabela: `orders`
```sql
- id (UUID)
- user_id (UUID) - FK para auth.users
- booking_id (UUID) - FK para bookings
- total_amount (DECIMAL)
- status (TEXT) - pending, paid, cancelled, refunded
- payment_method (TEXT)
- payment_details (JSONB)
- created_at (TIMESTAMP)
```

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React + TypeScript
- **Styling:** Tailwind CSS v4
- **Autenticação:** Supabase Auth
- **Banco de Dados:** PostgreSQL (via Supabase)
- **Icons:** Lucide React
- **Forms:** React Hooks

## 🐛 Troubleshooting

### Problema: Não consigo fazer login
**Solução:**
1. Verifique se o banco de dados está configurado
2. Verifique se a tabela `profiles` existe
3. Verifique se o email está correto
4. Tente resetar a senha

### Problema: Agendamento não aparece no dashboard
**Solução:**
1. Verifique se você está logado
2. Verifique as políticas RLS no Supabase
3. Verifique no console do navegador por erros
4. Confirme que o agendamento foi criado no banco

### Problema: Checkout não funciona
**Solução:**
1. Verifique se você está logado
2. Preencha todos os campos obrigatórios
3. Verifique a conexão com Supabase
4. Olhe os logs no console

### Problema: Imagens não aparecem
**Solução:**
1. Verifique se o upload foi bem-sucedido
2. Para produção, configure Supabase Storage
3. Verifique permissões de bucket (se usando Storage)

## 📝 Notas Importantes

1. **Dados Locais (Painel Admin):** 
   - Os dados do painel admin (`/admin`) são salvos em localStorage
   - Para persistência real, migre para Supabase

2. **Confirmação de Email:**
   - Desabilitada para desenvolvimento
   - Habilite para produção

3. **Pagamentos:**
   - Atualmente são simulados
   - Não processar dados reais de cartão
   - Integrar gateway real para produção

4. **Performance:**
   - Otimize imagens antes do upload
   - Use lazy loading para imagens grandes
   - Considere CDN para assets estáticos

## 🎯 Próximos Passos (Sugestões)

- [ ] Integrar gateway de pagamento real
- [ ] Adicionar notificações por email/SMS
- [ ] Implementar calendário visual para agendamentos
- [ ] Adicionar sistema de avaliações
- [ ] Criar app mobile (React Native)
- [ ] Implementar programa de fidelidade
- [ ] Adicionar cupons de desconto
- [ ] Sistema de lembretes automáticos
- [ ] Relatórios e analytics para admin
- [ ] Backup automático de dados

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique a documentação do Supabase
- Consulte os logs do console
- Revise o arquivo `/supabase/SETUP.md`

---

**Desenvolvido com 🍋 para Lemon's Car**
