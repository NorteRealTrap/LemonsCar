# 🍋 Lemon's Car - Sistema Completo de Gestão Automotiva

Sistema completo para lavagem e estética automotiva com checkout avançado, autenticação de clientes, área administrativa e muito mais.

## ✨ Funcionalidades Principais

### 🌐 Site Público
- ✅ Landing page profissional e responsiva
- ✅ Catálogo de serviços interativo
- ✅ Sistema de agendamento online
- ✅ Formulário de contato
- ✅ Botão flutuante de WhatsApp
- ✅ 100% mobile-friendly

### 👤 Área do Cliente (`/dashboard`)
- ✅ Cadastro e login de clientes
- ✅ Perfil pessoal
- ✅ Histórico de agendamentos
- ✅ Histórico de pedidos e pagamentos
- ✅ Status de serviços em tempo real

### 💳 Sistema de Checkout
- ✅ **PIX** - Pagamento instantâneo (5% desconto)
- ✅ **Cartão de Crédito** - Parcelamento até 6x
- ✅ **Cartão de Débito** - Aprovação rápida (3% desconto)
- ✅ **Dinheiro** - Pagamento no local (10% desconto)
- ✅ Interface profissional e segura
- ✅ Validação de campos
- ✅ Confirmação instantânea

### ⚙️ Painel Administrativo (`/admin`)
- ✅ CRUD completo de serviços
- ✅ Gerenciamento de imagens
- ✅ Configurações do site
- ✅ Dashboard com estatísticas
- ✅ Setup de banco de dados integrado

## 🚀 Início Rápido

### 1. Acessar o Sistema

**Site Principal:**
```
URL: /
```

**Área do Cliente:**
```
URL: /dashboard
Requer: Cadastro de cliente
```

**Painel Admin:**
```
URL: /admin
Usuário: admin
Senha: lemonscar2026
```

### 2. Configurar Banco de Dados

O sistema usa Supabase. Para configurar:

1. Acesse `/admin` → Tab "Setup Banco"
2. Siga as instruções passo a passo
3. Execute o script SQL fornecido

**OU** veja documentação completa em `/supabase/SETUP.md`

### 3. Primeiro Uso

1. **Cadastre serviços** no painel admin
2. **Crie uma conta de cliente** no site
3. **Faça um agendamento de teste**
4. **Processe um checkout simulado**
5. **Veja o histórico** no dashboard do cliente

## 📂 Estrutura do Projeto

```
/
├── components/
│   ├── admin/              # Painel administrativo
│   │   ├── AdminPanel.tsx
│   │   ├── ServiceManager.tsx
│   │   ├── ImageManager.tsx
│   │   └── SetupGuide.tsx
│   ├── auth/               # Autenticação
│   │   └── LoginModal.tsx
│   ├── checkout/           # Sistema de pagamento
│   │   └── CheckoutModal.tsx
│   ├── client/             # Área do cliente
│   │   └── ClientDashboard.tsx
│   ├── Header.tsx
│   ├── HomeSection.tsx
│   ├── ServicesSection.tsx
│   ├── BookingSection_New.tsx
│   ├── ContactSection.tsx
│   └── WhatsAppButton.tsx
├── contexts/
│   ├── AuthContext.tsx     # Contexto de autenticação
│   └── SiteDataContext.tsx # Contexto de dados do site
├── utils/
│   └── supabase/
│       └── client.tsx      # Cliente Supabase
├── supabase/
│   ├── migrations/         # Scripts SQL
│   └── SETUP.md           # Guia de configuração
├── GUIA_COMPLETO.md       # Documentação completa
└── DEPLOY.md              # Guia de deploy
```

## 🔐 Segurança

### Autenticação
- Senhas hasheadas pelo Supabase
- JWT tokens para sessões
- Row Level Security (RLS) ativado
- Cada usuário vê apenas seus dados

### Permissões
- **Cliente:** Acesso apenas aos próprios agendamentos
- **Admin:** Acesso total ao painel administrativo

### Pagamentos
⚠️ **IMPORTANTE:** Os pagamentos são **simulados** para demonstração.

Para produção real:
- Integre gateway de pagamento (Stripe, Mercado Pago, etc.)
- Nunca armazene dados completos de cartão
- Use PCI-DSS compliance
- Configure SSL/HTTPS obrigatório

## 🎨 Personalização

### Cores do Tema
```css
Primária (Amarelo): #FFD700
Secundária (Preto): #000000
```

### Alterar Informações
1. Acesse `/admin`
2. Vá em "Configurações"
3. Edite os dados desejados
4. As mudanças são aplicadas imediatamente

### Adicionar Serviços
1. Acesse `/admin`
2. Vá em "Serviços"
3. Clique em "Novo Serviço"
4. Preencha nome, descrição, preço, duração e características

## 📱 Responsividade

Totalmente otimizado para:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1440px+)

## 🛠️ Tecnologias

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth
- **Icons:** Lucide React
- **Build:** Vite

## 📊 Banco de Dados

### Tabelas Principais

**profiles**
- Perfis de usuários (clientes e admins)

**bookings**
- Agendamentos de serviços

**orders**
- Pedidos e pagamentos

**kv_store_fb74e6f3**
- Key-value store para dados do painel admin

## 🚢 Deploy

Para fazer deploy em produção, consulte `/DEPLOY.md` para:
- Configuração do Supabase
- Deploy no Vercel/Netlify
- Variáveis de ambiente
- Checklist de segurança
- Integração com gateway de pagamento real

## 📖 Documentação Completa

- **GUIA_COMPLETO.md** - Tutorial completo do sistema
- **DEPLOY.md** - Guia de deploy para produção
- **supabase/SETUP.md** - Configuração do banco de dados

## 🐛 Troubleshooting

### ⚠️ Erros Comuns e Soluções

**Consulte o guia completo:** [`/ERROS_COMUNS.md`](/ERROS_COMUNS.md)

### Problema: "Email not confirmed"
**Solução Rápida:**
1. Acesse Supabase Dashboard
2. Authentication → Settings
3. **Desmarque** "Enable email confirmations"
4. Tente criar conta novamente

### Problema: "Could not find table profiles"
**Solução:**
1. Acesse `/admin` → Tab "Setup Banco"
2. Execute o script SQL no Supabase
3. Aguarde confirmação
4. Recarregue a página

### Problema: Não consigo fazer login
**Solução:**
1. Verifique se o banco está configurado
2. Execute o script de migração
3. Confirme que a tabela `profiles` existe
4. Verifique se desabilitou "email confirmations"

### Problema: Checkout não funciona
**Solução:**
- Verifique se você está logado
- Preencha todos os campos obrigatórios
- Verifique conexão com Supabase
- Olhe os logs no console

### Problema: Agendamento não aparece
**Solução:**
- Confirme que você está logado
- Verifique políticas RLS no Supabase
- Olhe os logs no console do navegador
- Recarregue a página

**📚 Para mais soluções, veja:** [`/ERROS_COMUNS.md`](/ERROS_COMUNS.md)

## 📞 Contato

**Informações no site:**
- Endereço: Rua Luiz Manoel de Queiroz, 1004
- WhatsApp: (19) 98906-7707
- Instagram: @lemons_car

## 🎯 Roadmap Futuro

- [ ] App mobile (React Native)
- [ ] Gateway de pagamento real
- [ ] Notificações por email/SMS
- [ ] Calendário visual de agendamentos
- [ ] Sistema de avaliações
- [ ] Programa de fidelidade
- [ ] Cupons de desconto
- [ ] Relatórios e analytics
- [ ] Multi-tenancy (várias unidades)

## ⚠️ Avisos Importantes

1. **Pagamentos Simulados:** Este é um sistema de demonstração. Não processar dados reais de cartão sem gateway apropriado.

2. **Dados Sensíveis:** Não expor SUPABASE_SERVICE_ROLE_KEY no frontend.

3. **Email Confirmation:** Para produção, ative confirmação de email e configure provedor de email.

4. **Backup:** Configure backups automáticos do banco de dados antes de usar em produção.

## 📝 Licença

Este projeto foi desenvolvido para a Lemon's Car.

---

**Desenvolvido com 🍋 para revolucionar a gestão automotiva**

Para mais informações, consulte a documentação completa em `/GUIA_COMPLETO.md`.