# 📸 Gerenciador de Imagens e 📧 Notificações por Email

## 1. 🖼️ Sistema de Armazenamento de Imagens

### Estrutura

O sistema de imagens foi configurado com:

- **Bucket Supabase**: `images` (público)
- **Tabela de Metadados**: `image_uploads` (rastreia todas as imagens)
- **Categorias**: hero, service, gallery, logo, general

### Como Usar

#### No Painel Admin:

```tsx
// ImageManager.tsx já está configurado para:
1. Fazer upload de imagens
2. Selecionar categoria
3. Visualizar por categoria
4. Deletar imagens (apenas admins)
5. Mostrar tamanho do arquivo e data
```

#### No Código TypeScript:

```typescript
import { imageService } from '@/utils/supabase/imageService';

// Upload de imagem
const result = await imageService.uploadImage({
  file: inputFile,
  category: 'gallery',
  description: 'Descrição opcional'
});

// Buscar imagens por categoria
const images = await imageService.getImagesByCategory('gallery');

// Deletar imagem
await imageService.deleteImage(imageId, filePath);

// Obter URL pública
const url = imageService.getPublicUrl(filePath);
```

### 🔐 Segurança

- ✅ Upload: Apenas usuários autenticados
- ✅ Visualização: Público (sem login necessário)
- ✅ Deleção: Apenas admins
- ✅ Limite de arquivo: 5MB
- ✅ Tipos permitidos: Apenas imagens

---

## 2. 📧 Sistema de Notificações por Email

### Configuração Necessária

Você precisa:

1. **Conta SendGrid** (https://sendgrid.com)
2. **API Key do SendGrid**
3. **Domínio verificado** no SendGrid (opcional, mas recomendado)

### Passos para Configurar:

#### 1. Criar Conta SendGrid
- Acesse https://sendgrid.com
- Crie uma conta gratuita (15 emails/dia)
- Confirme seu email

#### 2. Gerar API Key
- Dashboard → API Keys → Create API Key
- Copie a chave (ela não será exibida novamente!)

#### 3. Adicionar no Supabase
No painel Supabase:
- Edge Functions → send-email → Settings
- Adicione a variável de ambiente:
  ```
  SENDGRID_API_KEY = sua_chave_aqui
  ```

#### 4. Verificar Domínio (Recomendado)
- SendGrid → Settings → Sender Authentication
- Siga as instruções para adicionar registros DNS

### Como Usar

```typescript
import { emailService } from '@/utils/supabase/emailService';

// 1. Enviar confirmação de agendamento
await emailService.sendBookingConfirmation({
  customerName: 'João Silva',
  customerEmail: 'joao@email.com',
  serviceName: 'Lavagem Completa',
  date: '2026-01-25',
  time: '10:00',
  vehicleModel: 'Honda Civic 2020',
  vehiclePlate: 'ABC-1234',
  price: 'R$ 150,00'
});

// 2. Enviar confirmação de pagamento
await emailService.sendPaymentConfirmation({
  customerName: 'João Silva',
  customerEmail: 'joao@email.com',
  amount: 'R$ 150,00',
  paymentMethod: 'Cartão de Crédito',
  transactionId: 'txn_123456'
});

// 3. Notificar admin
await emailService.notifyAdmin({
  adminEmail: 'admin@lemonscar.com.br',
  notificationType: 'new_booking',
  userName: 'João Silva',
  userEmail: 'joao@email.com',
  message: 'Novo agendamento de Lavagem Completa'
});
```

### Exemplo de Integração

No componente de agendamento:

```typescript
// BookingSection_New.tsx

const handleBookingSubmit = async (bookingData) => {
  try {
    // 1. Salvar agendamento no banco
    const booking = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();

    // 2. Enviar email de confirmação
    if (booking.data) {
      await emailService.sendBookingConfirmation({
        customerName: user.user_metadata.full_name,
        customerEmail: user.email,
        serviceName: bookingData.service_name,
        date: bookingData.date,
        time: bookingData.time,
        vehicleModel: bookingData.vehicle_model,
        vehiclePlate: bookingData.vehicle_plate,
        price: bookingData.service_price
      });

      // 3. Notificar admin
      await emailService.notifyAdmin({
        adminEmail: 'seu-email@lemonscar.com.br',
        notificationType: 'new_booking',
        userName: user.user_metadata.full_name,
        userEmail: user.email,
        message: `Novo agendamento de ${bookingData.service_name}`
      });
    }

    toast.success('Agendamento realizado! Verifique seu email');
  } catch (error) {
    toast.error('Erro ao agendar');
  }
};
```

---

## 3. 📋 Configuração do SQL

Execute este SQL no Supabase para criar o bucket:

```sql
-- Arquivo: src/supabase/migrations/002_create_storage_bucket.sql
-- Já está criado, execute no SQL Editor do Supabase
```

### Scripts já executados:

✅ 001_initial_setup.sql - Tabelas principais (profiles, bookings, orders)
✅ 002_create_storage_bucket.sql - Bucket e tabela de imagens

---

## 4. 📊 Estrutura de Emails

### Template: Confirmação de Agendamento

```
Assunto: Agendamento Confirmado - Lemon's Car

Conteúdo:
- Saudação personalizada
- Detalhes do serviço
- Data e hora
- Informações do veículo
- Valor
- Mensagem de obrigado
```

### Template: Confirmação de Pagamento

```
Assunto: Pagamento Confirmado - Lemon's Car

Conteúdo:
- Saudação personalizada
- Valor pago
- Método de pagamento
- ID da transação
- Data
```

### Template: Notificação para Admin

```
Assunto: [ADMIN] Novo evento - Lemon's Car

Conteúdo:
- Tipo de notificação
- Nome do usuário
- Email do usuário
- Mensagem customizada
- Data/Hora
```

---

## 5. 🚀 Próximas Melhorias

- [ ] Adicionar template HTML personalizável
- [ ] Suporte a anexos (recibos, comprovantes)
- [ ] Agendamento de emails
- [ ] Rastreamento de aberturas
- [ ] A/B testing de emails
- [ ] Integração com WhatsApp

---

## ⚠️ Troubleshooting

### Email não está sendo enviado?

1. **Verificar API Key**
   ```bash
   Supabase → Edge Functions → send-email → Logs
   ```

2. **Verificar domínio**
   - SendGrid rejeita emails se o domínio não está verificado
   - Use um domínio verificado ou crie-o no SendGrid

3. **Verificar CORS**
   - A função Edge precisa de CORS configurado
   - Verifique as headers na resposta

4. **Testar manualmente**
   ```bash
   curl -X POST https://seu-projeto.supabase.co/functions/v1/send-email \
     -H "Content-Type: application/json" \
     -d '{
       "to": "seu-email@example.com",
       "subject": "Teste",
       "type": "booking_confirmation",
       "data": {...}
     }'
   ```

---

## 📚 Recursos

- [Documentação SendGrid](https://sendgrid.com/docs/)
- [Edge Functions Supabase](https://supabase.com/docs/guides/functions)
- [Storage Supabase](https://supabase.com/docs/guides/storage)

