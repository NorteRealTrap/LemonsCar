# 📧 Integração de Emails - Guia Completo

## ✅ Componentes Já Integrados

### 1. **BookingSection_New.tsx** (Agendamentos)
Quando um cliente cria um agendamento:
- ✅ Email de confirmação é enviado automaticamente
- ✅ Contém detalhes do serviço, data, hora e veículo

```typescript
// Automaticamente chamado ao submeter formulário
await emailService.sendBookingConfirmation({
  customerName: profile?.full_name,
  customerEmail: user.email,
  serviceName: selectedService.name,
  date: formData.date,
  time: formData.time,
  vehicleModel: formData.vehicleModel,
  vehiclePlate: formData.vehiclePlate,
  price: selectedService.price,
});
```

### 2. **CheckoutModal.tsx** (Pagamentos)
Quando um cliente confirma o pagamento:
- ✅ Email de confirmação de pagamento é enviado
- ✅ Contém valor, método de pagamento e ID da transação

```typescript
// Automaticamente chamado ao finalizar pagamento
await emailService.sendPaymentConfirmation({
  customerName: user?.user_metadata?.full_name,
  customerEmail: user?.email,
  amount: booking.service_price,
  paymentMethod: selectedMethod,
  transactionId: `txn_${Date.now()}`,
});
```

---

## 📋 Como Adicionar Emails em Outros Componentes

### Exemplo 1: Enviar Email ao Atualizar Serviço (Admin)

**Arquivo:** `src/components/admin/ServiceManager.tsx`

```typescript
import { emailService } from '../../utils/supabase/emailService';

// Ao salvar mudanças em um serviço
const handleServiceUpdate = async (serviceData) => {
  try {
    // Salvar no banco
    const { data, error } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', serviceId);

    if (error) throw error;

    // Notificar admin que houve mudança
    await emailService.notifyAdmin({
      adminEmail: 'seu-email@lemonscar.com.br',
      notificationType: 'service_update',
      userName: 'Admin',
      userEmail: user.email,
      message: `Serviço "${serviceData.name}" foi atualizado`
    });

    toast.success('Serviço atualizado!');
  } catch (error) {
    toast.error('Erro ao atualizar');
  }
};
```

### Exemplo 2: Notificar Admin sobre Novo Agendamento

**Arquivo:** `src/components/BookingSection_New.tsx` (já integrado!)

```typescript
// Já está sendo feito após criar agendamento
// Você pode adicionar uma notificação ao admin também:

// Após emailService.sendBookingConfirmation, adicione:
await emailService.notifyAdmin({
  adminEmail: 'admin@lemonscar.com.br',
  notificationType: 'new_booking',
  userName: profile?.full_name || 'Cliente',
  userEmail: user.email || '',
  message: `Novo agendamento de ${selectedService.name} em ${formData.date}`
});
```

### Exemplo 3: Formulário de Contato com Email

**Novo arquivo:** `src/components/ContactFormHandler.tsx`

```typescript
import { emailService } from '../utils/supabase/emailService';

export const handleContactFormSubmit = async (formData) => {
  try {
    // Salvar no banco (se quiser)
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        created_at: new Date().toISOString(),
      });

    if (error) throw error;

    // Email de confirmação para o cliente
    await emailService.sendContactConfirmation({
      customerName: formData.name,
      customerEmail: formData.email,
      message: formData.message,
    });

    // Notificar admin
    await emailService.notifyAdmin({
      adminEmail: 'admin@lemonscar.com.br',
      notificationType: 'contact_form',
      userName: formData.name,
      userEmail: formData.email,
      message: formData.message,
    });

    toast.success('Mensagem enviada! Responderemos em breve.');
  } catch (error) {
    toast.error('Erro ao enviar mensagem');
  }
};
```

---

## 🔧 Configurações Necessárias

### 1. SendGrid API Key
```bash
Supabase → Edge Functions → send-email → Settings
Variável de Ambiente: SENDGRID_API_KEY
```

### 2. Email do Admin
Defina o email do admin em uma variável de ambiente ou no contexto:

```typescript
// .env.local
VITE_ADMIN_EMAIL=seu-email@lemonscar.com.br
```

```typescript
// Use no código
const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@lemonscar.com.br';
```

### 3. Testes Locais
Para testar emails localmente sem enviar de verdade:

```typescript
// Mock do emailService
const emailService = {
  sendBookingConfirmation: async (data) => {
    console.log('Email de agendamento:', data);
    return true;
  },
  sendPaymentConfirmation: async (data) => {
    console.log('Email de pagamento:', data);
    return true;
  },
  notifyAdmin: async (data) => {
    console.log('Notificação admin:', data);
    return true;
  }
};
```

---

## 📊 Fluxo de Emails Atual

```
┌─────────────────────┐
│ Cliente Acessa Site │
└──────────┬──────────┘
           ↓
┌─────────────────────────────┐
│ Clica em "Agendar Serviço"  │
└──────────┬──────────────────┘
           ↓
┌──────────────────────────────┐      ┌─────────────────────┐
│ Preenche Formulário          │─────→│ Email Confirmação   │
│ de Agendamento               │      │ de Agendamento      │
└──────────┬───────────────────┘      └─────────────────────┘
           ↓
┌──────────────────────────────┐
│ Modal de Checkout            │
└──────────┬───────────────────┘
           ↓
┌──────────────────────────────┐      ┌─────────────────────┐
│ Seleciona Método de          │─────→│ Email Confirmação   │
│ Pagamento e Confirma         │      │ de Pagamento        │
└──────────┬───────────────────┘      └─────────────────────┘
           ↓
┌─────────────────────┐
│ Pagamento Realizado │
└─────────────────────┘
```

---

## 🚀 Próximas Melhorias

- [ ] Email de cancelamento de agendamento
- [ ] Lembrete de agendamento 24h antes
- [ ] Email de feedback após serviço completado
- [ ] Notificação de erro para admin
- [ ] Suporte a templates personalizáveis
- [ ] Histórico de emails enviados

---

## ⚠️ Troubleshooting

### Email não está sendo enviado?

1. **Verificar API Key do SendGrid**
   ```bash
   Supabase → Logs → Edge Functions → send-email
   ```

2. **Verificar domínio verificado**
   - SendGrid requer domínio verificado para enviar
   - Use um domínio verificado ou account verificado

3. **Testar manualmente**
   ```bash
   curl -X POST https://seu-projeto.supabase.co/functions/v1/send-email \
     -H "Authorization: Bearer token" \
     -H "Content-Type: application/json" \
     -d '{...}'
   ```

4. **Verificar logs**
   - Supabase → Edge Functions → send-email → Logs
   - Procure por erros de CORS, autenticação ou SendGrid

---

## 📚 Referências

- [SendGrid Email API](https://sendgrid.com/docs/for-developers/sending-email/api-overview/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Toast Notifications (Sonner)](https://sonner.emilkowal.ski/)

