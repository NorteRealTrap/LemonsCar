import Deno from "https://deno.land/x/fresh@1.0.0/server.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Configure SendGrid API Key
const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY") || "";

interface EmailData {
  to: string;
  subject: string;
  type: "booking_confirmation" | "payment_confirmation" | "admin_notification";
  data: Record<string, any>;
}

const emailTemplates = {
  booking_confirmation: (data: any) => ({
    subject: "Agendamento Confirmado - Lemon's Car",
    html: `
      <h2>Seu agendamento foi confirmado!</h2>
      <p>Olá <strong>${data.customerName}</strong>,</p>
      <p>Seu agendamento foi realizado com sucesso!</p>
      
      <h3>Detalhes do Agendamento:</h3>
      <ul>
        <li><strong>Serviço:</strong> ${data.serviceName}</li>
        <li><strong>Data:</strong> ${new Date(data.date).toLocaleDateString("pt-BR")}</li>
        <li><strong>Horário:</strong> ${data.time}</li>
        <li><strong>Veículo:</strong> ${data.vehicleModel} (${data.vehiclePlate})</li>
        <li><strong>Valor:</strong> ${data.price}</li>
      </ul>
      
      <p>Se houver alguma dúvida, entre em contato conosco pelo WhatsApp.</p>
      <p>Obrigado por escolher a Lemon's Car!</p>
    `,
  }),
  
  payment_confirmation: (data: any) => ({
    subject: "Pagamento Confirmado - Lemon's Car",
    html: `
      <h2>Seu pagamento foi confirmado!</h2>
      <p>Olá <strong>${data.customerName}</strong>,</p>
      <p>Recebemos seu pagamento com sucesso!</p>
      
      <h3>Detalhes do Pagamento:</h3>
      <ul>
        <li><strong>Valor:</strong> ${data.amount}</li>
        <li><strong>Método:</strong> ${data.paymentMethod}</li>
        <li><strong>ID da Transação:</strong> ${data.transactionId}</li>
        <li><strong>Data:</strong> ${new Date().toLocaleDateString("pt-BR")}</li>
      </ul>
      
      <p>Seu agendamento está confirmado. Veja você em breve!</p>
    `,
  }),
  
  admin_notification: (data: any) => ({
    subject: `[ADMIN] Novo ${data.notificationType} - Lemon's Car`,
    html: `
      <h2>Nova notificação de administrador</h2>
      <p><strong>Tipo:</strong> ${data.notificationType}</p>
      <p><strong>Usuário:</strong> ${data.userName}</p>
      <p><strong>Email:</strong> ${data.userEmail}</p>
      <p><strong>Mensagem:</strong> ${data.message}</p>
      <p><strong>Data:</strong> ${new Date().toLocaleString("pt-BR")}</p>
    `,
  }),
};

async function sendEmail(emailData: EmailData) {
  if (!SENDGRID_API_KEY) {
    console.warn("SendGrid API Key não configurada. Email não será enviado.");
    return { success: false, message: "SendGrid não configurado" };
  }

  const template = emailTemplates[emailData.type](emailData.data);

  const requestBody = {
    personalizations: [
      {
        to: [{ email: emailData.to }],
      },
    ],
    from: {
      email: "noreply@lemonscar.com.br",
      name: "Lemon's Car",
    },
    subject: emailData.subject || template.subject,
    content: [
      {
        type: "text/html",
        value: template.html,
      },
    ],
  };

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`SendGrid error: ${error}`);
    }

    return { success: true, message: "Email enviado com sucesso" };
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return { success: false, message: error.message };
  }
}

serve(async (req: Request) => {
  // CORS headers
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const emailData = await req.json() as EmailData;

    // Validação
    if (!emailData.to || !emailData.subject || !emailData.type || !emailData.data) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await sendEmail(emailData);

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
