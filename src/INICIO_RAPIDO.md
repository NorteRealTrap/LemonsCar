# 🚀 Início Rápido - Lemon's Car

## ⚡ Em 5 Minutos

### Passo 1: Configure o Banco (2 min)
1. Acesse **`/admin`** no navegador
2. Login: `admin` / Senha: `lemonscar2026`
3. Clique na aba **"Setup Banco"**
4. Copie o script SQL (botão de copiar)
5. Abra [Supabase Dashboard](https://app.supabase.com)
6. SQL Editor → Cole o script → Run
7. ✅ Confirmação de sucesso

### Passo 2: Desabilite Confirmação de Email (1 min)
1. No Supabase: **Authentication** → **Settings**
2. **Desmarque** "Enable email confirmations"
3. Save

### Passo 3: Teste o Sistema (2 min)
1. Volte para `/` (página inicial)
2. Clique em **"Entrar"** no header
3. Crie uma conta de teste
4. Escolha um serviço
5. Faça um agendamento
6. Complete o checkout

✅ **Pronto!** Sistema funcionando!

---

## 📍 URLs Importantes

| Página | URL | Acesso |
|--------|-----|--------|
| Site | `/` | Público |
| Área do Cliente | `/dashboard` | Requer login |
| Painel Admin | `/admin` | admin / lemonscar2026 |

---

## 🎯 O Que Você Pode Fazer

### Sem Configurar Banco
- ✅ Navegar pelo site
- ✅ Ver serviços
- ✅ Acessar painel admin
- ✅ Editar configurações (localStorage)
- ❌ Login de clientes
- ❌ Agendamentos
- ❌ Checkout

### Com Banco Configurado
- ✅ **TUDO acima** +
- ✅ Login/cadastro de clientes
- ✅ Agendamentos completos
- ✅ Checkout com pagamentos
- ✅ Dashboard do cliente
- ✅ Histórico de pedidos

---

## 🔧 Solução de Problemas

### "Email not confirmed"
```
Supabase → Authentication → Settings
Desmarque "Enable email confirmations"
```

### "Table profiles not found"
```
Execute o script SQL no Supabase
(veja Passo 1 acima)
```

### Banner amarelo aparece
```
Isso é normal! É um aviso para configurar o banco.
Siga o Passo 1 para resolver.
```

---

## 📚 Documentação Completa

- **Erros Comuns:** `/ERROS_COMUNS.md`
- **Guia Completo:** `/GUIA_COMPLETO.md`
- **Deploy:** `/DEPLOY.md`
- **README:** `/README.md`

---

## 💡 Dicas Rápidas

1. **Primeiro Acesso:** Configure o banco de dados primeiro
2. **Teste Local:** Desabilite confirmação de email
3. **Painel Admin:** Use para configurar serviços e informações
4. **WhatsApp:** O botão verde flutuante abre chat direto
5. **Responsivo:** Teste em mobile! Funciona perfeitamente

---

## 🎨 Personalizar o Site

### No Painel Admin (`/admin`):

**Serviços:**
- Adicionar/editar/remover serviços
- Definir preços e durações
- Personalizar descrições

**Imagens:**
- Upload de fotos
- Gerenciar galeria

**Configurações:**
- Nome do site
- Endereço
- Telefone/WhatsApp
- Instagram
- Email
- Horários de funcionamento

---

## ✅ Checklist de Configuração

- [ ] Banco de dados configurado
- [ ] Email confirmations desabilitado (dev)
- [ ] Pelo menos 1 serviço cadastrado
- [ ] Informações de contato atualizadas
- [ ] Conta de cliente de teste criada
- [ ] Agendamento de teste feito
- [ ] Checkout testado

**Tudo marcado? Parabéns! 🎉**

---

## 🆘 Precisa de Ajuda?

1. Console do navegador (F12) → Tab Console
2. Procure mensagens de erro em vermelho
3. Consulte `/ERROS_COMUNS.md`
4. Revise este guia passo a passo

---

## 🚀 Próximos Passos

Depois de configurar:

1. **Cadastre todos os serviços** da Lemon's Car
2. **Atualize as informações** de contato
3. **Faça upload de imagens** reais
4. **Teste em diferentes dispositivos**
5. **Convide pessoas** para testar
6. **Para produção:** Veja `/DEPLOY.md`

---

**Tempo total estimado:** 5-10 minutos ⏱️

**Dificuldade:** Fácil ⭐

**Suporte:** Documentação completa disponível 📖
