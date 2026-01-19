import { supabase } from './client';

interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  date: string;
  time: string;
  vehicleModel: string;
  vehiclePlate: string;
  price: string;
}

interface PaymentEmailData {
  customerName: string;
  customerEmail: string;
  amount: string;
  paymentMethod: string;
  transactionId: string;
}

interface AdminNotificationData {
  adminEmail: string;
  notificationType: 'new_booking' | 'new_payment' | 'user_signup' | 'contact_form';
  userName: string;
  userEmail: string;
  message: string;
}

export const emailService = {
  /**
   * Enviar email de confirmação de agendamento
   */
  async sendBookingConfirmation(data: BookingEmailData): Promise<boolean> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}`,
          },
          body: JSON.stringify({
            to: data.customerEmail,
            subject: 'Agendamento Confirmado - Lemon\'s Car',
            type: 'booking_confirmation',
            data,
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Erro ao enviar email de agendamento:', error);
      return false;
    }
  },

  /**
   * Enviar email de confirmação de pagamento
   */
  async sendPaymentConfirmation(data: PaymentEmailData): Promise<boolean> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}`,
          },
          body: JSON.stringify({
            to: data.customerEmail,
            subject: 'Pagamento Confirmado - Lemon\'s Car',
            type: 'payment_confirmation',
            data,
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Erro ao enviar email de pagamento:', error);
      return false;
    }
  },

  /**
   * Notificar admin sobre novo agendamento, pagamento, etc
   */
  async notifyAdmin(data: AdminNotificationData): Promise<boolean> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}`,
          },
          body: JSON.stringify({
            to: data.adminEmail,
            type: 'admin_notification',
            data,
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Erro ao notificar admin:', error);
      return false;
    }
  },
};
