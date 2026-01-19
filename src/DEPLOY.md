# 🚀 Guia de Deploy - Lemon's Car

## Pré-requisitos

Antes de fazer o deploy, certifique-se de ter:

- [ ] Conta no Supabase configurada
- [ ] Banco de dados configurado (script em `/supabase/migrations/001_initial_setup.sql`)
- [ ] Serviços cadastrados
- [ ] Primeiro usuário admin criado

## Checklist de Segurança

### Antes do Deploy

- [ ] **Ativar confirmação de email** no Supabase
  - Authentication → Settings → Enable email confirmations ✓
  
- [ ] **Configurar provedor de email** no Supabase
  - Authentication → Settings → Email Templates
  - Configure SMTP ou use SendGrid/Resend

- [ ] **Configurar domínio customizado** (opcional)
  - Project Settings → General → Custom Domain

- [ ] **Ativar RLS** em todas as tabelas
  - Já está configurado no script de migração

- [ ] **Revisar políticas de segurança**
  - Verificar que usuários só acessam seus dados

- [ ] **Configurar variáveis de ambiente**
  - SUPABASE_URL
  - SUPABASE_ANON_KEY

### Configurações de Produção

#### 1. Supabase Settings

**Authentication**
```
✓ Enable email confirmations
✓ Configure password requirements (min 8 chars)
✓ Enable MFA/2FA para admins (recomendado)
✓ Configure email templates (welcome, reset password)
```

**API Settings**
```
✓ Rate limiting ativado
✓ CORS configurado corretamente
✓ Logs habilitados
```

**Database**
```
✓ Backups automáticos ativados
✓ Point-in-time recovery configurado
✓ Connection pooling otimizado
```

#### 2. Variáveis de Ambiente

Criar arquivo `.env.production`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica
```

**⚠️ NUNCA exponha:**
- `SUPABASE_SERVICE_ROLE_KEY` no frontend
- Dados de cartão de crédito
- Chaves privadas de API

#### 3. Build para Produção

```bash
# Instalar dependências
npm install

# Build
npm run build

# Testar build localmente
npm run preview
```

#### 4. Deploy Options

**Opção A: Vercel (Recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy para produção
vercel --prod
```

**Configurações Vercel:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Environment Variables: Adicione suas variáveis

**Opção B: Netlify**
```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Deploy para produção
netlify deploy --prod
```

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Opção C: Cloudflare Pages**
- Conecte seu repositório
- Build command: `npm run build`
- Build output directory: `dist`
- Adicione environment variables

## Após o Deploy

### 1. Testar Funcionalidades Críticas

- [ ] Cadastro de novo usuário
- [ ] Login de usuário existente
- [ ] Criar agendamento
- [ ] Processar checkout (todos os métodos)
- [ ] Visualizar dashboard do cliente
- [ ] Acesso ao painel admin
- [ ] Upload de imagens (se configurou Storage)

### 2. Configurar Monitoramento

**Supabase**
- Ativar alertas de erro
- Configurar notificações
- Monitorar uso de banco de dados

**Analytics (Opcional)**
```bash
npm install @vercel/analytics
# ou
npm install @plausible/tracker
```

### 3. Performance

**Otimizações:**
- [ ] Compressão Gzip/Brotli ativada
- [ ] Cache de assets estáticos
- [ ] CDN configurado
- [ ] Imagens otimizadas
- [ ] Lazy loading implementado

### 4. SEO (Opcional)

Adicionar meta tags em `index.html`:

```html
<head>
  <title>Lemon's Car - Lavagem e Estética Automotiva</title>
  <meta name="description" content="Lemon's Car - Os melhores serviços de lavagem e estética automotiva. Agende online!">
  <meta property="og:title" content="Lemon's Car">
  <meta property="og:description" content="Lavagem e Estética Automotiva">
  <meta property="og:image" content="/logo.png">
</head>
```

## Integração com Gateway de Pagamento Real

### Para implementar pagamentos reais, escolha um gateway:

**Stripe (Recomendado para internacional)**
```bash
npm install @stripe/stripe-js
```

**Mercado Pago (Brasil)**
```bash
npm install @mercadopago/sdk-react
```

**PagSeguro (Brasil)**
```bash
npm install pagseguro
```

**Passos:**
1. Criar conta no gateway escolhido
2. Obter chaves API (test e production)
3. Implementar SDK no checkout
4. Configurar webhooks para confirmação
5. Testar em sandbox
6. Ativar em produção

**⚠️ Lembrete de Compliance:**
- PCI-DSS compliance necessário
- HTTPS obrigatório
- Nunca armazenar dados completos de cartão
- Usar tokenização
- Implementar 3D Secure

## Backup e Recuperação

### Backup Manual
```bash
# Exportar dados do Supabase
supabase db dump -f backup.sql

# Backup de imagens (se usando Storage)
supabase storage download --bucket public
```

### Backup Automático
- Configurar no Supabase Dashboard
- Retenção: 7 dias (mínimo)
- Point-in-time recovery: 24h

## Troubleshooting

### Erro: "Failed to fetch"
**Causa:** CORS ou URL do Supabase incorreta
**Solução:**
- Verificar variáveis de ambiente
- Conferir CORS no Supabase
- Verificar se o domínio está autorizado

### Erro: "Row Level Security"
**Causa:** Políticas RLS bloqueando acesso
**Solução:**
- Verificar políticas no SQL Editor
- Confirmar que o usuário está autenticado
- Revisar script de migração

### Erro: "Email not confirmed"
**Causa:** Confirmação de email ativada
**Solução:**
- Para produção: configurar email provider
- Para dev: desativar confirmação

## Custos Estimados

**Supabase (Free Tier):**
- 500MB banco de dados
- 1GB file storage
- 50MB edge functions
- 50,000 monthly active users
- Suficiente para começar

**Upgrade para Pro:** $25/mês
- 8GB banco de dados
- 100GB file storage
- Melhor suporte
- Mais recursos

**Vercel/Netlify:**
- Free tier suficiente para começar
- Pro: $20/mês (se necessário)

## Manutenção

### Diário
- [ ] Verificar logs de erro
- [ ] Monitorar uso de recursos
- [ ] Responder tickets de suporte

### Semanal
- [ ] Revisar novos agendamentos
- [ ] Backup manual (adicional)
- [ ] Atualizar conteúdo

### Mensal
- [ ] Analisar métricas de uso
- [ ] Otimizar banco de dados
- [ ] Atualizar dependências
- [ ] Revisar custos

## Suporte

Em caso de problemas:

1. **Supabase:** https://supabase.com/docs
2. **Vercel:** https://vercel.com/docs
3. **React:** https://react.dev

---

## ✅ Checklist Final de Deploy

- [ ] Banco de dados configurado
- [ ] Migrations executadas
- [ ] Email confirmations configurado
- [ ] Primeiro admin criado
- [ ] Serviços cadastrados
- [ ] Build testado localmente
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado
- [ ] Testes de funcionalidade OK
- [ ] Domínio customizado configurado (opcional)
- [ ] SSL/HTTPS ativo
- [ ] Monitoramento configurado
- [ ] Backups automáticos ativos
- [ ] Documentação atualizada

**Parabéns! 🎉 Seu sistema está no ar!**
