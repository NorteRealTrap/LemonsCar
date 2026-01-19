import { Droplets, Sparkles, Wrench, Check } from 'lucide-react@0.487.0';
import { useSiteData } from '../contexts/SiteDataContext';

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  iconName: string; // Changed from icon component to icon name
  features: string[];
}

// Icon mapping
const iconMap: Record<string, any> = {
  droplets: Droplets,
  sparkles: Sparkles,
  wrench: Wrench,
};

export const defaultServices: Service[] = [
  {
    id: 'lavagem-completa',
    name: 'Lavagem Completa',
    description: 'Limpeza profunda externa e interna do seu veículo',
    duration: '2-3 horas',
    price: 'R$ 150,00',
    iconName: 'droplets',
    features: [
      'Lavagem externa completa',
      'Limpeza interna detalhada',
      'Aspiração profunda',
      'Limpeza de vidros',
      'Hidratação de plásticos',
      'Perfumização',
    ],
  },
  {
    id: 'polimento',
    name: 'Polimento',
    description: 'Restauração do brilho e proteção da pintura',
    duration: '4-6 horas',
    price: 'R$ 350,00',
    iconName: 'sparkles',
    features: [
      'Polimento técnico',
      'Remoção de riscos leves',
      'Cristalização da pintura',
      'Aplicação de cera protetora',
      'Brilho duradouro',
      'Proteção UV',
    ],
  },
  {
    id: 'manutencao-expressa',
    name: 'Manutenção Expressa',
    description: 'Limpeza rápida para manter seu carro impecável',
    duration: '45-60 minutos',
    price: 'R$ 80,00',
    iconName: 'wrench',
    features: [
      'Lavagem externa rápida',
      'Limpeza interna básica',
      'Aspiração',
      'Limpeza de vidros',
      'Aromatização',
    ],
  },
];

interface ServicesSectionProps {
  onSelectService?: (service: Service) => void;
}

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const { services } = useSiteData();
  
  // Use serviços do contexto ou serviços padrão se não houver nenhum cadastrado
  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <section className="min-h-screen py-20 bg-gradient-to-b from-black to-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl mb-4 text-white">
            Nossos <span className="text-primary">Serviços</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Oferecemos os melhores serviços de estética automotiva com qualidade premium
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {displayServices.map((service, index) => {
            const IconComponent = iconMap[service.iconName] || Droplets;
            
            return (
            <div
              key={service.id}
              className="bg-secondary border border-primary/20 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-primary/20 animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Card Header */}
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-6 border-b border-primary/20">
                <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl mb-2 text-white">{service.name}</h3>
                <p className="text-gray-400 mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Duração</p>
                    <p className="text-primary">{service.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">A partir de</p>
                    <p className="text-2xl text-primary">{service.price}</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <h4 className="text-sm text-gray-400 mb-3">Inclui:</h4>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-gray-300">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onSelectService?.(service)}
                  className="w-full bg-primary text-black py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
                >
                  Agendar Serviço
                </button>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}