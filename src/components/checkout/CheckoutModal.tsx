import { useState } from 'react';
import { X, CreditCard, Smartphone, Barcode, DollarSign, Check, AlertTriangle } from 'lucide-react@0.487.0';
import { supabase } from '../../utils/supabase/client';
import { useAuth } from '../../contexts/AuthContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    service_name: string;
    service_price: string;
    date: string;
    time: string;
    vehicle_model: string;
    vehicle_plate: string;
  };
  bookingId?: string;
}

type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'cash';

export function CheckoutModal({ isOpen, onClose, booking, bookingId }: CheckoutModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<'payment' | 'success'>('payment');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('pix');
  const [loading, setLoading] = useState(false);

  // Dados do cartão
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState('1');

  if (!isOpen) return null;

  const priceValue = parseFloat(booking.service_price.replace('R$', '').replace(',', '.').trim());

  const paymentMethods = [
    {
      id: 'pix' as PaymentMethod,
      name: 'PIX',
      icon: Smartphone,
      description: 'Aprovação instantânea',
      discount: '5% de desconto',
    },
    {
      id: 'credit_card' as PaymentMethod,
      name: 'Cartão de Crédito',
      icon: CreditCard,
      description: 'Parcelamento em até 6x',
      discount: null,
    },
    {
      id: 'debit_card' as PaymentMethod,
      name: 'Cartão de Débito',
      icon: CreditCard,
      description: 'Aprovação rápida',
      discount: '3% de desconto',
    },
    {
      id: 'cash' as PaymentMethod,
      name: 'Dinheiro',
      icon: DollarSign,
      description: 'Pagamento no local',
      discount: '10% de desconto',
    },
  ];

  const handlePayment = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const paymentDetails: any = { method: selectedMethod };

      if (selectedMethod === 'credit_card' || selectedMethod === 'debit_card') {
        paymentDetails.card = {
          last4: cardNumber.slice(-4),
          brand: 'visa', // Simulação
          installments: selectedMethod === 'credit_card' ? parseInt(installments) : 1,
        };
      }

      // Criar pedido no banco de dados
      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          booking_id: bookingId || null,
          total_amount: priceValue,
          status: selectedMethod === 'cash' ? 'pending' : 'paid',
          payment_method: selectedMethod,
          payment_details: paymentDetails,
        });

      if (error) throw error;

      // Atualizar status do agendamento se existir
      if (bookingId) {
        await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', bookingId);
      }

      setStep('success');
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-secondary border border-primary/20 rounded-2xl max-w-2xl w-full my-8">
        <div className="p-6 border-b border-primary/20 flex justify-between items-center">
          <h2 className="text-2xl text-white">
            {step === 'payment' ? 'Finalizar Pagamento' : 'Pagamento Confirmado!'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {step === 'payment' ? (
          <div className="p-6">
            {/* Resumo do Pedido */}
            <div className="bg-black border border-primary/20 rounded-xl p-4 mb-6">
              <h3 className="text-white mb-3">Resumo do Pedido</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Serviço:</span>
                  <span className="text-white">{booking.service_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Data:</span>
                  <span className="text-white">{booking.date} às {booking.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Veículo:</span>
                  <span className="text-white">{booking.vehicle_model} - {booking.vehicle_plate}</span>
                </div>
                <div className="pt-2 border-t border-primary/20 flex justify-between">
                  <span className="text-white font-semibold">Total:</span>
                  <span className="text-primary text-xl font-bold">{booking.service_price}</span>
                </div>
              </div>
            </div>

            {/* Métodos de Pagamento */}
            <div className="mb-6">
              <h3 className="text-white mb-4">Escolha a forma de pagamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedMethod === method.id
                          ? 'border-primary bg-primary/10'
                          : 'border-primary/20 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          selectedMethod === method.id ? 'bg-primary/20' : 'bg-primary/10'
                        }`}>
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white mb-1">{method.name}</h4>
                          <p className="text-xs text-gray-400">{method.description}</p>
                          {method.discount && (
                            <p className="text-xs text-primary mt-1">{method.discount}</p>
                          )}
                        </div>
                        {selectedMethod === method.id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detalhes do Pagamento */}
            {selectedMethod === 'pix' && (
              <div className="bg-black border border-primary/20 rounded-xl p-6 mb-6">
                <div className="text-center">
                  <div className="bg-white w-48 h-48 mx-auto mb-4 rounded-lg flex items-center justify-center">
                    <Barcode className="w-32 h-32 text-black" />
                  </div>
                  <p className="text-gray-400 text-sm mb-2">Escaneie o QR Code com seu app de pagamento</p>
                  <div className="bg-secondary border border-primary/20 rounded-lg p-3">
                    <code className="text-xs text-primary break-all">
                      00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000
                    </code>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Após o pagamento, você receberá uma confirmação automática
                  </p>
                </div>
              </div>
            )}

            {(selectedMethod === 'credit_card' || selectedMethod === 'debit_card') && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Número do Cartão</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nome no Cartão</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                    placeholder="NOME COMO ESTÁ NO CARTÃO"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Validade</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                      placeholder="MM/AA"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">CVV</label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>

                {selectedMethod === 'credit_card' && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Parcelas</label>
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                      className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>
                          {num}x de R$ {(priceValue / num).toFixed(2).replace('.', ',')} {num === 1 ? 'sem juros' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {selectedMethod === 'cash' && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
                <p className="text-green-400 text-sm">
                  ✓ Pagamento será realizado no local. Tenha o valor exato em mãos.
                  Você terá 10% de desconto pagando em dinheiro!
                </p>
              </div>
            )}

            {/* Botão de Confirmação */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-primary text-black py-4 rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processando...' : selectedMethod === 'cash' ? 'Confirmar Agendamento' : 'Confirmar Pagamento'}
            </button>

            <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-400">
                <strong>Ambiente de Demonstração:</strong> Este é um checkout simulado para fins de teste. 
                Nenhuma transação real será processada.
              </p>
            </div>

            <p className="text-xs text-gray-500 text-center mt-2">
              🔒 Ambiente seguro. Seus dados estão protegidos.
            </p>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl text-white mb-2">Pagamento Confirmado!</h3>
            <p className="text-gray-400 mb-6">
              Seu agendamento foi confirmado com sucesso.
            </p>
            <div className="bg-black border border-primary/20 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-gray-400 mb-2">Detalhes do agendamento:</p>
              <p className="text-white">{booking.service_name}</p>
              <p className="text-gray-400 text-sm">{booking.date} às {booking.time}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-primary text-black py-3 rounded-lg hover:bg-primary/90 transition-all"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}