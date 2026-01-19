import { useState } from 'react';
import { Save, Settings as SettingsIcon } from 'lucide-react@0.487.0';
import { useSiteData } from '../../contexts/SiteDataContext';

export function SettingsManager() {
  const { settings, updateSettings } = useSiteData();
  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="w-6 h-6 text-primary" />
        <h2 className="text-2xl text-white">Configurações do Site</h2>
      </div>

      <div className="bg-secondary border border-primary/20 rounded-xl p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Nome do Site</label>
            <input
              type="text"
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              placeholder="Ex: Lemon's Car"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">WhatsApp</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                placeholder="(19) 98906-7707"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Instagram</label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                placeholder="@lemons_car"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">E-mail</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                placeholder="contato@lemonscar.com.br"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Horário de Funcionamento</label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                placeholder="Seg-Sex: 8h-18h | Sáb: 8h-14h"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Endereço Completo</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              placeholder="Rua Luiz Manoel de Queiroz, 1004"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105"
            >
              <Save className="w-5 h-5" />
              Salvar Configurações
            </button>

            {saved && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2 text-green-400 text-sm">
                ✓ Configurações salvas com sucesso!
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <h3 className="text-blue-400 mb-2">💡 Dica</h3>
        <p className="text-sm text-gray-400">
          Estas configurações serão aplicadas em todo o site. As mudanças aparecerão imediatamente nas seções de Contato e rodapé.
        </p>
      </div>
    </div>
  );
}