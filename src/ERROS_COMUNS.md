# 🔧 Soluções para Erros Comuns

## Erro: "Could not find the table 'public.profiles' in the schema cache"

### Causa
As tabelas do banco de dados ainda não foram criadas no Supabase.

### Solução
1. Acesse `/admin` → Tab "Setup Banco"
2. Copie o script SQL fornecido
3. Abra o Supabase Dashboard → SQL Editor
4. Execute o script completo
5. Aguarde a confirmação de sucesso
6. Recarregue a página do site

**Status:** O sistema funcionará em modo básico até configurar o banco. O aviso amarelo desaparecerá após a configuração.

---

## Erro: "Email not confirmed"

### Causa
O Supabase está configurado para exigir confirmação de email, mas você não configurou um provedor de email.

### Solução Rápida (Desenvolvimento)
1. Acesse o Supabase Dashboard
2. Vá em **Authentication** → **Settings**
3. **Desmarque** "Enable email confirmations"
4. Salve as alterações
5. Tente criar conta novamente

### Solução para Produção
Configure um provedor de email:
1. Supabase Dashboard → **Authentication** → **Email Templates**
2. Configure SMTP ou use SendGrid/Resend
3. Configure os templates de email
4. Teste o envio de confirmação

**Nota:** Sem confirmação de email, qualquer pessoa pode criar contas. Use apenas em desenvolvimento!

---

## Erro: "For security purposes, you can only request this after 1 seconds"

### Causa
Rate limiting do Supabase - você está fazendo requisições muito rápido.

### Solução
Aguarde 1-2 segundos entre tentativas de login/cadastro.

**Prevenção:** O sistema já implementa debounce, mas se clicar muito rápido pode acontecer.

---

## Erro: "Invalid login credentials"

### Causa
Email ou senha incorretos.

### Solução
1. Verifique se digitou o email corretamente
2. Verifique se a senha está correta (mínimo 6 caracteres)
3. Se esqueceu a senha, use "Recuperar senha"
4. Verifique se a conta já foi criada

---

## Erro: "User already registered"

### Causa
Já existe uma conta com este email.

### Solução
1. Use a opção "Entrar" ao invés de "Cadastrar"
2. Se esqueceu a senha, use "Recuperar senha"
3. Se o email foi digitado errado, use o correto

---

## Erro: Agendamento não aparece no dashboard

### Causa Possível 1: Banco não configurado
**Solução:** Configure o banco seguindo as instruções em `/admin` → Setup Banco

### Causa Possível 2: Políticas RLS
**Solução:** Verifique se executou o script SQL completo, incluindo as políticas.

### Causa Possível 3: Não está logado
**Solução:** Faça login novamente.

### Como Verificar
1. Abra o console do navegador (F12)
2. Vá na aba "Console"
3. Verifique se há erros em vermelho
4. Se houver erro de CORS ou RLS, revise as configurações do Supabase

---

## Erro: Checkout não funciona

### Solução
1. Verifique se você está logado
2. Preencha todos os campos obrigatórios
3. Verifique se o banco de dados está configurado
4. Olhe o console para mensagens de erro específicas

---

## Erro: Banner amarelo "Banco de Dados Não Configurado"

### Isso não é um erro!
É um aviso amigável informando que você precisa configurar o banco.

### Como Resolver
1. Clique em "Configurar Agora" no banner
2. Siga o passo a passo na aba "Setup Banco"
3. Após executar o script SQL, o banner desaparecerá automaticamente

---

## Erro: Imagens não aparecem

### Causa
As imagens do painel admin são armazenadas localmente no localStorage.

### Solução
1. Verifique se o upload foi bem-sucedido
2. Para produção, considere usar Supabase Storage
3. Recarregue a página

---

## Erro: Painel admin não abre

### Solução
1. Acesse `/admin` diretamente
2. Use as credenciais:
   - Usuário: `admin`
   - Senha: `lemonscar2026`
3. Limpe o cache do navegador se necessário

---

## Como Obter Ajuda

### 1. Verificar Logs
Abra o console do navegador (F12) e veja as mensagens de erro detalhadas.

### 2. Verificar Configuração
- Banco de dados: Acesse `/admin` → Setup Banco
- Autenticação: Verifique o Supabase Dashboard
- Serviços: Cadastre ao menos um serviço no painel admin

### 3. Resetar Sistema
Se tudo falhar:
1. Limpe localStorage: `localStorage.clear()` no console
2. Recarregue a página
3. Refaça a configuração do banco
4. Crie uma nova conta

---

## Checklist de Configuração

Use este checklist para garantir que tudo está configurado:

**Banco de Dados:**
- [ ] Script SQL executado no Supabase
- [ ] Tabelas criadas (profiles, bookings, orders)
- [ ] Políticas RLS ativas
- [ ] Confirmação de email desabilitada (dev)

**Painel Admin:**
- [ ] Consegue acessar `/admin`
- [ ] Login funciona (admin/lemonscar2026)
- [ ] Pelo menos 1 serviço cadastrado

**Autenticação:**
- [ ] Consegue criar conta
- [ ] Consegue fazer login
- [ ] Perfil aparece no header
- [ ] Dashboard do cliente acessível

**Funcionalidades:**
- [ ] Pode selecionar serviço
- [ ] Formulário de agendamento funciona
- [ ] Checkout abre corretamente
- [ ] Agendamento aparece no dashboard

---

## Configuração Mínima para Teste

Para testar o sistema sem configurar o banco completo:

1. ✅ **Site funciona** sem banco (navegação, visualização)
2. ✅ **Painel admin** funciona independente (localStorage)
3. ⚠️ **Login/Agendamentos** requerem banco configurado

**Recomendação:** Configure o banco completo para experiência total!

---

## Suporte Adicional

- Documentação completa: `/GUIA_COMPLETO.md`
- Guia de deploy: `/DEPLOY.md`
- Setup do banco: `/supabase/SETUP.md`
- Documentação Supabase: https://supabase.com/docs
