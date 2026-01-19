import { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, Car, CheckCircle2 } from 'lucide-react@0.487.0';
import { services, Service } from './ServicesSection';

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  carModel: string;
  service: string;
  date: string;
  time: string;
}

interface BookingSectionProps {
  preSelectedService?: Service;
}

export function BookingSection({ preSelectedService }: BookingSectionProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    carModel: '',
    service: preSelectedService?.id || '',
    date: '',
    time: '',
  });

  const [errors, setErrors] = useState<Partial<BookingFormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<BookingFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Telefone inválido';
    }

    if (!formData.carModel.trim()) {
      newErrors.carModel = 'Modelo do carro é obrigatório';
    }

    if (!formData.service) {
      newErrors.service = 'Selecione um serviço';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    if (!formData.time) {
      newErrors.time = 'Horário é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitted(true);
      // Aqui você enviaria os dados para um backend
      console.log('Agendamento realizado:', formData);
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhoneChange = (value: string) => {
    // Formata o telefone automaticamente
    const numbers = value.replace(/\D/g, '');
    let formatted = numbers;
    
    if (numbers.length > 10) {
      formatted = numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numbers.length > 6) {
      formatted = numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (numbers.length > 2) {
      formatted = numbers.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    
    handleInputChange('phone', formatted);
  };

  const selectedService = services.find(s => s.id === formData.service);

  if (isSubmitted) {
    return (
      <section className="min-h-screen py-20 bg-gradient-to-b from-secondary to-black flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center animate-fade-in">
            <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl mb-4 text-white">
              Agendamento <span className="text-primary">Confirmado!</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Seu agendamento foi realizado com sucesso. Você receberá uma confirmação por email.
            </p>
            
            <div className="bg-secondary border border-primary/20 rounded-2xl p-8 mb-8 text-left">
              <h3 className="text-xl mb-4 text-primary">Detalhes do Agendamento</h3>
              <div className="space-y-3 text-gray-300">
                <p><strong className="text-white">Nome:</strong> {formData.name}</p>
                <p><strong className="text-white">Serviço:</strong> {selectedService?.name}</p>
                <p><strong className="text-white">Veículo:</strong> {formData.carModel}</p>
                <p><strong className="text-white">Data:</strong> {new Date(formData.date).toLocaleDateString('pt-BR')}</p>
                <p><strong className="text-white">Horário:</strong> {formData.time}</p>
                <p><strong className="text-white">Duração estimada:</strong> {selectedService?.duration}</p>
                <p><strong className="text-white">Valor:</strong> {selectedService?.price}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  carModel: '',
                  service: '',
                  date: '',
                  time: '',
                });
              }}
              className="bg-primary text-black px-8 py-4 rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
            >
              Fazer Novo Agendamento
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-20 bg-gradient-to-b from-secondary to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl mb-4 text-white">
            Agende seu <span className="text-primary">Serviço</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Escolha o serviço ideal e agende o melhor horário para você
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seleção de Serviço */}
            <div className="bg-secondary border border-primary/20 rounded-2xl p-6 md:p-8 animate-fade-in">
              <h3 className="text-2xl mb-6 text-white flex items-center gap-2">
                <Calendar className="text-primary" />
                Escolha o Serviço
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => handleInputChange('service', service.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      formData.service === service.id
                        ? 'border-primary bg-primary/10'
                        : 'border-primary/20 hover:border-primary/50 bg-black/20'
                    }`}
                  >
                    <service.icon className={`w-8 h-8 mb-2 ${formData.service === service.id ? 'text-primary' : 'text-gray-400'}`} />
                    <h4 className="text-white mb-1">{service.name}</h4>
                    <p className="text-sm text-gray-400">{service.price}</p>
                    <p className="text-xs text-gray-500">{service.duration}</p>
                  </button>
                ))}
              </div>
              {errors.service && (
                <p className="text-red-500 text-sm mt-2">{errors.service}</p>
              )}
            </div>

            {/* Informações Pessoais */}
            <div className="bg-secondary border border-primary/20 rounded-2xl p-6 md:p-8 animate-fade-in">
              <h3 className="text-2xl mb-6 text-white flex items-center gap-2">
                <User className="text-primary" />
                Suas Informações
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">Nome Completo *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full bg-black/50 border ${errors.name ? 'border-red-500' : 'border-primary/20'} rounded-lg px-12 py-3 text-white focus:border-primary focus:outline-none transition-colors`}
                      placeholder="Seu nome"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full bg-black/50 border ${errors.email ? 'border-red-500' : 'border-primary/20'} rounded-lg px-12 py-3 text-white focus:border-primary focus:outline-none transition-colors`}
                      placeholder="seu@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Telefone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className={`w-full bg-black/50 border ${errors.phone ? 'border-red-500' : 'border-primary/20'} rounded-lg px-12 py-3 text-white focus:border-primary focus:outline-none transition-colors`}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Modelo do Veículo *</label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.carModel}
                      onChange={(e) => handleInputChange('carModel', e.target.value)}
                      className={`w-full bg-black/50 border ${errors.carModel ? 'border-red-500' : 'border-primary/20'} rounded-lg px-12 py-3 text-white focus:border-primary focus:outline-none transition-colors`}
                      placeholder="Ex: Honda Civic 2020"
                    />
                  </div>
                  {errors.carModel && (
                    <p className="text-red-500 text-sm mt-1">{errors.carModel}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Data e Horário */}
            <div className="bg-secondary border border-primary/20 rounded-2xl p-6 md:p-8 animate-fade-in">
              <h3 className="text-2xl mb-6 text-white flex items-center gap-2">
                <Clock className="text-primary" />
                Data e Horário
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2">Data *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full bg-black/50 border ${errors.date ? 'border-red-500' : 'border-primary/20'} rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors`}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Horário *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleInputChange('time', time)}
                        className={`py-2 px-4 rounded-lg border-2 transition-all duration-300 ${
                          formData.time === time
                            ? 'border-primary bg-primary text-black'
                            : 'border-primary/20 text-gray-400 hover:border-primary/50'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  {errors.time && (
                    <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Resumo e Botão */}
            {selectedService && (
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-2xl p-6 md:p-8 animate-fade-in">
                <h3 className="text-xl mb-4 text-primary">Resumo do Agendamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-gray-300">
                  <div>
                    <p className="text-sm text-gray-500">Serviço</p>
                    <p className="text-white">{selectedService.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duração</p>
                    <p className="text-white">{selectedService.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Valor</p>
                    <p className="text-2xl text-primary">{selectedService.price}</p>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary text-black py-4 rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
                >
                  Confirmar Agendamento
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}