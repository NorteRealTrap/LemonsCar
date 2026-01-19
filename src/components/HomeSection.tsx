import { Sparkles, Award, Clock } from 'lucide-react@0.487.0';

export function HomeSection() {
  const features = [
    {
      icon: Sparkles,
      title: 'Qualidade Premium',
      description: 'Serviços de excelência com produtos de primeira linha',
    },
    {
      icon: Clock,
      title: 'Rapidez',
      description: 'Atendimento ágil sem comprometer a qualidade',
    },
    {
      icon: Award,
      title: 'Profissionais',
      description: 'Equipe especializada e certificada',
    },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1761312834150-4beefff097a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjB3YXNoJTIwZGV0YWlsaW5nfGVufDF8fHx8MTc2ODM3MjgxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Car detailing"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Text */}
          <div className="mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-7xl mb-6 text-white">
              Bem-vindo à <span className="text-primary">Lemon's Car</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Transformamos seu carro com cuidado profissional e paixão por detalhes
            </p>
            <button className="bg-primary text-black px-8 py-4 rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/50">
              Agende Agora
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-secondary/50 backdrop-blur-sm border border-primary/20 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full" />
        </div>
      </div>
    </section>
  );
}