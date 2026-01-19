import { useState } from 'react';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react@0.487.0';
import { useSiteData, SiteImage } from '../../contexts/SiteDataContext';

export function ImageManager() {
  const { images, addImage, deleteImage } = useSiteData();
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage: SiteImage = {
          id: `img-${Date.now()}-${Math.random()}`,
          name: file.name,
          url: event.target?.result as string,
          category: 'gallery',
          uploadedAt: new Date().toISOString(),
        };
        addImage(newImage);
      };
      reader.readAsDataURL(file);
    });
    setUploading(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta imagem?')) {
      deleteImage(id);
    }
  };

  const groupedImages = {
    hero: images.filter(img => img.category === 'hero'),
    service: images.filter(img => img.category === 'service'),
    gallery: images.filter(img => img.category === 'gallery'),
    logo: images.filter(img => img.category === 'logo'),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-white">Gerenciar Imagens</h2>
        <label className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg hover:bg-primary/90 transition-all cursor-pointer">
          <Upload className="w-5 h-5" />
          Upload de Imagens
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {uploading && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-400">
          Fazendo upload das imagens...
        </div>
      )}

      {Object.entries(groupedImages).map(([category, categoryImages]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg text-white capitalize">
            {category === 'hero' ? 'Hero/Banner' : 
             category === 'service' ? 'Serviços' :
             category === 'gallery' ? 'Galeria' : 'Logo'}
            <span className="text-gray-500 text-sm ml-2">({categoryImages.length})</span>
          </h3>

          {categoryImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoryImages.map((image) => (
                <div
                  key={image.id}
                  className="bg-secondary border border-primary/20 rounded-xl overflow-hidden hover:border-primary/50 transition-all group"
                >
                  <div className="aspect-square bg-black flex items-center justify-center overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-white truncate mb-2">{image.name}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(image.uploadedAt).toLocaleDateString('pt-BR')}
                      </span>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-secondary border border-primary/20 rounded-xl p-8 text-center text-gray-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma imagem nesta categoria</p>
            </div>
          )}
        </div>
      ))}

      {images.length === 0 && (
        <div className="bg-secondary border border-primary/20 rounded-xl p-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">Nenhuma imagem cadastrada</h3>
          <p className="text-gray-400 mb-4">
            Faça upload das primeiras imagens para começar a galeria
          </p>
        </div>
      )}

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <h3 className="text-blue-400 mb-2">💡 Sobre o gerenciamento de imagens</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• As imagens são armazenadas localmente no navegador</li>
          <li>• Formatos aceitos: JPG, PNG, GIF, WebP</li>
          <li>• Recomendado: imagens otimizadas para web (até 2MB)</li>
          <li>• Para produção, conecte ao Supabase para armazenamento em nuvem</li>
        </ul>
      </div>
    </div>
  );
}