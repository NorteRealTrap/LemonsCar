import { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Droplets, Sparkles, Wrench, Zap } from 'lucide-react@0.487.0';
import { useSiteData } from '../../contexts/SiteDataContext';
import { Service } from '../ServicesSection';

const iconOptions = [
  { name: 'droplets', label: 'Droplets', icon: Droplets },
  { name: 'sparkles', label: 'Sparkles', icon: Sparkles },
  { name: 'wrench', label: 'Wrench', icon: Wrench },
  { name: 'zap', label: 'Zap', icon: Zap },
];

// Icon mapping
const iconMap: Record<string, any> = {
  droplets: Droplets,
  sparkles: Sparkles,
  wrench: Wrench,
  zap: Zap,
};

export function ServiceManager() {
  const { services, addService, updateService, deleteService } = useSiteData();
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({
    name: '',
    description: '',
    duration: '',
    price: '',
    features: [''],
  });
  const [selectedIcon, setSelectedIcon] = useState('droplets');

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData(service);
    setSelectedIcon(service.iconName || 'droplets');
    setIsEditing(true);
  };

  const handleNew = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      duration: '',
      price: '',
      features: [''],
    });
    setSelectedIcon('droplets');
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.description || !formData.duration || !formData.price) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const service: Service = {
      id: editingService?.id || `service-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      duration: formData.duration,
      price: formData.price,
      iconName: selectedIcon,
      features: formData.features?.filter(f => f.trim() !== '') || [],
    };

    if (editingService) {
      updateService(editingService.id, service);
    } else {
      addService(service);
    }

    setIsEditing(false);
    setEditingService(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingService(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      deleteService(id);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...(formData.features || []), ''] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features?.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-white">Gerenciar Serviços</h2>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg hover:bg-primary/90 transition-all"
        >
          <Plus className="w-5 h-5" />
          Novo Serviço
        </button>
      </div>

      {isEditing ? (
        <div className="bg-secondary border border-primary/20 rounded-xl p-6">
          <h3 className="text-xl text-white mb-6">
            {editingService ? 'Editar Serviço' : 'Novo Serviço'}
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nome do Serviço *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black border border-primary/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  placeholder="Ex: Lavagem Completa"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Ícone</label>
                <select
                  value={selectedIcon}
                  onChange={(e) => setSelectedIcon(e.target.value)}
                  className="w-full bg-black border border-primary/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                >
                  {iconOptions.map(opt => (
                    <option key={opt.name} value={opt.name}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Duração *</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full bg-black border border-primary/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  placeholder="Ex: 2-3 horas"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Preço *</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-black border border-primary/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  placeholder="Ex: R$ 150,00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Descrição *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-black border border-primary/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary h-20"
                placeholder="Descreva o serviço..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm text-gray-400">Características</label>
                <button
                  onClick={addFeature}
                  className="text-primary hover:text-primary/80 text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar
                </button>
              </div>
              <div className="space-y-2">
                {formData.features?.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 bg-black border border-primary/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                      placeholder="Ex: Lavagem externa completa"
                    />
                    <button
                      onClick={() => removeFeature(index)}
                      className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-primary text-black px-6 py-2 rounded-lg hover:bg-primary/90 transition-all"
            >
              <Save className="w-5 h-5" />
              Salvar
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all"
            >
              <X className="w-5 h-5" />
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => {
            const IconComponent = iconMap[service.iconName || 'droplets'];
            return (
              <div
                key={service.id}
                className="bg-secondary border border-primary/20 rounded-xl p-4 hover:border-primary/50 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg text-white mb-1">{service.name}</h3>
                <p className="text-sm text-gray-400 mb-2">{service.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{service.duration}</span>
                  <span className="text-primary">{service.price}</span>
                </div>
              </div>
            );
          })}

          {services.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              Nenhum serviço cadastrado. Clique em "Novo Serviço" para começar.
            </div>
          )}
        </div>
      )}
    </div>
  );
}