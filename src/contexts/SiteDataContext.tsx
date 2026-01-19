import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Service, defaultServices } from '../components/ServicesSection';

export interface SiteSettings {
  siteName: string;
  address: string;
  whatsapp: string;
  instagram: string;
  email: string;
  workingHours: string;
}

export interface SiteImage {
  id: string;
  name: string;
  url: string;
  category: 'hero' | 'service' | 'gallery' | 'logo';
  uploadedAt: string;
}

interface SiteDataContextType {
  services: Service[];
  settings: SiteSettings;
  images: SiteImage[];
  addService: (service: Service) => void;
  updateService: (id: string, service: Service) => void;
  deleteService: (id: string) => void;
  updateSettings: (settings: SiteSettings) => void;
  addImage: (image: SiteImage) => void;
  deleteImage: (id: string) => void;
}

const defaultSettings: SiteSettings = {
  siteName: "Lemon's Car",
  address: "Rua Luiz Manoel de Queiroz, 1004",
  whatsapp: "(19) 98906-7707",
  instagram: "@lemons_car",
  email: "contato@lemonscar.com.br",
  workingHours: "Seg-Sex: 8h-18h | Sáb: 8h-14h",
};

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(() => {
    const stored = localStorage.getItem('lemons-services');
    if (stored) {
      const parsedServices = JSON.parse(stored);
      // Se houver serviços salvos, use-os, senão use os padrão
      return parsedServices.length > 0 ? parsedServices : defaultServices;
    }
    return defaultServices;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const stored = localStorage.getItem('lemons-settings');
    return stored ? JSON.parse(stored) : defaultSettings;
  });

  const [images, setImages] = useState<SiteImage[]>(() => {
    const stored = localStorage.getItem('lemons-images');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('lemons-services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('lemons-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('lemons-images', JSON.stringify(images));
  }, [images]);

  const addService = (service: Service) => {
    setServices(prev => [...prev, service]);
  };

  const updateService = (id: string, service: Service) => {
    setServices(prev => prev.map(s => s.id === id ? service : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const updateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
  };

  const addImage = (image: SiteImage) => {
    setImages(prev => [...prev, image]);
  };

  const deleteImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <SiteDataContext.Provider
      value={{
        services,
        settings,
        images,
        addService,
        updateService,
        deleteService,
        updateSettings,
        addImage,
        deleteImage,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within SiteDataProvider');
  }
  return context;
}