import { useState } from 'react';
import { Calendar, Clock, Car, Package, Droplets, Sparkles, Wrench } from 'lucide-react@0.487.0';
import { Service } from './ServicesSection';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from './auth/LoginModal';
import { CheckoutModal } from './checkout/CheckoutModal';
import { supabase } from '../utils/supabase/client';
import { emailService } from '../utils/supabase/emailService';
import { useSiteData } from '../contexts/SiteDataContext';
import { toast } from 'sonner@2.0.3';

// Icon mapping for services
const iconMap: Record<string, any> = {
  droplets: Droplets,
  sparkles: Sparkles,
  wrench: Wrench,
};

interface BookingFormData {
  vehicleModel: string;
  vehiclePlate: string;
  service: string;
  date: string;
  time: string;
  notes: string;
}

interface BookingSectionProps {
  preSelectedService?: Service;
}

export function BookingSection({ preSelectedService }: BookingSectionProps) {
  const { user, profile } = useAuth();
  const { services: contextServices } = useSiteData();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [bookingId, setBookingId] = useState<string>();
  const [formData, setFormData] = useState<BookingFormData>({
    vehicleModel: '',
    vehiclePlate: '',
    service: preSelectedService?.id || '',
    date: '',
    time: '',
    notes: '',
  });

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // Usar serviços do contexto se disponíveis
  const availableServices = contextServices.length > 0 ? contextServices : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setLoginModalOpen(true);
      return;
    }

    const selectedService = availableServices.find(s => s.id === formData.service);
    if (!selectedService) return;

    try {
      // Criar agendamento no banco
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          service_id: selectedService.id,
          service_name: selectedService.name,
          service_price: selectedService.price,
          date: formData.date,
          time: formData.time,
          status: 'pending',
          vehicle_model: formData.vehicleModel,
          vehicle_plate: formData.vehiclePlate,
          notes: formData.notes,
        })
        .select()
        .single();

      if (error) throw error;

      // Enviar email de confirmação de agendamento
      try {
        await emailService.sendBookingConfirmation({
          customerName: profile?.full_name || 'Cliente',
          customerEmail: user.email || '',
          serviceName: selectedService.name,
          date: formData.date,
          time: formData.time,
          vehicleModel: formData.vehicleModel,
          vehiclePlate: formData.vehiclePlate,
          price: selectedService.price,
        });
        toast.success('Email de confirmação enviado!');
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
        toast.error('Erro ao enviar email de confirmação');
      }

      setBookingId(data.id);
      setCheckoutModalOpen(true);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      alert('Erro ao criar agendamento. Tente novamente.');
    }
  };

  const selectedService = availableServices.find(s => s.id === formData.service);

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <section className="min-h-screen py-20 bg-gradient-to-b from-secondary to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl mb-4 text-white">
              Agende seu <span className="text-primary">Serviço</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Escolha o melhor horário para cuidar do seu veículo
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-secondary border border-primary/20 rounded-2xl p-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Serviço */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-3">Escolha o Serviço *</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {availableServices.map((service) => {
                      const IconComponent = iconMap[service.iconName] || Package;
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, service: service.id }))}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            formData.service === service.id
                              ? 'border-primary bg-primary/10'
                              : 'border-primary/20 hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              formData.service === service.id ? 'bg-primary/20' : 'bg-primary/10'
                            }`}>
                              <IconComponent className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white mb-1 font-semibold truncate">{service.name}</h4>
                              <p className="text-primary text-sm">{service.price}</p>
                              <p className="text-xs text-gray-400 mt-1">{service.duration}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Modelo do Veículo */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    <Car className="w-4 h-4 inline mr-2" />
                    Modelo do Veículo *
                  </label>
                  <input
                    type="text"
                    value={formData.vehicleModel}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicleModel: e.target.value }))}
                    className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="Ex: Honda Civic 2020"
                    required
                  />
                </div>

                {/* Placa */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Placa do Veículo *
                  </label>
                  <input
                    type="text"
                    value={formData.vehiclePlate}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehiclePlate: e.target.value.toUpperCase() }))}
                    className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="ABC-1234"
                    required
                    maxLength={8}
                  />
                </div>

                {/* Data */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Data do Agendamento *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    min={today}
                    className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>

                {/* Horário */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Horário *
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    required
                  >
                    <option value="">Selecione um horário</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                {/* Observações */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">
                    Observações (opcional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors h-24 resize-none"
                    placeholder="Alguma informação adicional sobre seu veículo ou preferências..."
                  />
                </div>
              </div>

              {/* Resumo */}
              {selectedService && formData.date && formData.time && (
                <div className="mt-6 bg-black border border-primary/20 rounded-xl p-4">
                  <h3 className="text-primary mb-3">Resumo do Agendamento</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1">Serviço</p>
                      <p className="text-white">{selectedService.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Data</p>
                      <p className="text-white">{new Date(formData.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Horário</p>
                      <p className="text-white">{formData.time}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Valor</p>
                      <p className="text-primary font-semibold">{selectedService.price}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botão Submit */}
              <button
                type="submit"
                className="w-full mt-8 bg-primary text-black py-4 rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/30 font-semibold"
              >
                {user ? 'Continuar para Pagamento' : 'Fazer Login e Continuar'}
              </button>

              {!user && (
                <p className="text-center text-sm text-gray-400 mt-4">
                  Você precisa estar logado para fazer um agendamento
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)}
        defaultTab="signup"
      />

      {selectedService && (
        <CheckoutModal
          isOpen={checkoutModalOpen}
          onClose={() => {
            setCheckoutModalOpen(false);
            // Resetar formulário após checkout
            setFormData({
              vehicleModel: '',
              vehiclePlate: '',
              service: '',
              date: '',
              time: '',
              notes: '',
            });
          }}
          booking={{
            service_name: selectedService.name,
            service_price: selectedService.price,
            date: new Date(formData.date).toLocaleDateString('pt-BR'),
            time: formData.time,
            vehicle_model: formData.vehicleModel,
            vehicle_plate: formData.vehiclePlate,
          }}
          bookingId={bookingId}
        />
      )}
    </>
  );
}