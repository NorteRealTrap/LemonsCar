import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react@0.487.0';
import logo from 'figma:asset/eca4176b8d3b1a0c428ca7e1be088cc0422409ec.png';
import { useSiteData } from '../contexts/SiteDataContext';

export function ContactSection() {
  const { settings } = useSiteData();
  
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Endereço',
      content: settings.address,
      subcontent: 'São Paulo - SP',
    },
    {
      icon: Phone,
      title: 'Telefone',
      content: settings.whatsapp,
      subcontent: 'Segunda a Sábado',
    },
    {
      icon: Mail,
      title: 'Email',
      content: settings.email,
      subcontent: 'Respondemos em até 24h',
    },
    {
      icon: Clock,
      title: 'Horário',
      content: settings.workingHours.split('|')[0]?.trim() || 'Seg - Sex: 08:00 - 18:00',
      subcontent: settings.workingHours.split('|')[1]?.trim() || 'Sábado: 08:00 - 14:00',
    },
  ];

  const socialLinks = [
    {
      icon: Instagram,
      name: 'Instagram',
      url: `https://instagram.com/${settings.instagram.replace('@', '')}`,
      handle: settings.instagram,
    },
  ];

  return (
    <section className="min-h-screen py-20 bg-gradient-to-b from-black to-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl mb-4 text-white">
            Entre em <span className="text-primary">Contato</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Estamos prontos para atender você e cuidar do seu veículo
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((info, index) => (
              <div
                key={info.title}
                className="bg-secondary border border-primary/20 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <info.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg mb-2 text-white">{info.title}</h3>
                <p className="text-gray-300 mb-1">{info.content}</p>
                <p className="text-sm text-gray-500">{info.subcontent}</p>
              </div>
            ))}
          </div>

          {/* Map and Social */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2 bg-secondary border border-primary/20 rounded-2xl overflow-hidden animate-fade-in">
              <div className="h-[400px] bg-gradient-to-br from-primary/5 to-black flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl text-white mb-2">Nossa Localização</h3>
                  <p className="text-gray-400 mb-4">
                    Rua Luiz Manoel de Queiroz, 1004<br />
                    São Paulo - SP
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-primary text-black px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
                  >
                    Ver no Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media & Additional Info */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {/* Social Media */}
              <div className="bg-secondary border border-primary/20 rounded-2xl p-6">
                <h3 className="text-xl mb-4 text-white">Redes Sociais</h3>
                <div className="space-y-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      className="flex items-center gap-3 p-3 rounded-lg border border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
                    >
                      <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <social.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-white">{social.name}</p>
                        <p className="text-sm text-gray-400">{social.handle}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-2xl p-6">
                <h3 className="text-xl mb-4 text-primary">Atendimento Rápido</h3>
                <p className="text-gray-300 mb-4">
                  Entre em contato via WhatsApp e receba atendimento imediato!
                </p>
                <a
                  href="https://wa.me/5519989067707"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-primary text-black text-center py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
                >
                  Chamar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-primary/20 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-white/10">
              <img src={logo} alt="Lemon's Car" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl text-primary">Lemon's Car</span>
          </div>
          <p className="text-gray-400">
            © 2026 Lemon's Car. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 mt-2">
            Estética automotiva de excelência
          </p>
        </div>
      </div>
    </section>
  );
}