import { useState, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react@0.487.0';
import { imageService } from '../../utils/supabase/imageService';

interface ImageUpload {
  id: string;
  file_name: string;
  bucket_name: string;
  file_path: string;
  file_size: number;
  category: 'hero' | 'service' | 'gallery' | 'logo' | 'general';
  created_at: string;
}

export function ImageManager() {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<ImageUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Carregar imagens ao montar
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await imageService.getAllImages();
      setImages(data);
    } catch (err) {
      setError('Erro ao carregar imagens');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const fileArray = Array.from(files);
      const categorySelect = (document.getElementById('category-select') as HTMLSelectElement);
      const category = (categorySelect?.value || 'general') as any;

      for (const file of fileArray) {
        try {
          await imageService.uploadImage({
            file,
            category,
            description: file.name,
          });
        } catch (err: any) {
          setError(err.message || `Erro ao fazer upload de ${file.name}`);
        }
      }

      setSuccess(`${fileArray.length} imagem(ns) enviada(s) com sucesso!`);
      await loadImages();
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload de imagens');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (imageId: string, filePath: string) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) return;

    try {
      await imageService.deleteImage(imageId, filePath);
      setSuccess('Imagem deletada com sucesso!');
      await loadImages();
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar imagem');
    }
  };

  const groupedImages = {
    hero: images.filter(img => img.category === 'hero'),
    service: images.filter(img => img.category === 'service'),
    gallery: images.filter(img => img.category === 'gallery'),
    logo: images.filter(img => img.category === 'logo'),
    general: images.filter(img => img.category === 'general'),
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl text-white">Gerenciar Imagens</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            id="category-select"
            className="bg-secondary border border-primary/30 text-white px-3 py-2 rounded-lg"
            defaultValue="gallery"
          >
            <option value="hero">Hero/Banner</option>
            <option value="service">Serviços</option>
            <option value="gallery">Galeria</option>
            <option value="logo">Logo</option>
            <option value="general">Geral</option>
          </select>
          <label className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg hover:bg-primary/90 transition-all cursor-pointer whitespace-nowrap">
            <Upload className="w-5 h-5" />
            Upload
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>{success}</div>
        </div>
      )}

      {uploading && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-400 flex items-center gap-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
          Fazendo upload das imagens...
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Carregando imagens...</div>
      ) : (
        Object.entries(groupedImages).map(([category, categoryImages]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-lg text-white capitalize">
              {category === 'hero' ? 'Hero/Banner' :
               category === 'service' ? 'Serviços' :
               category === 'gallery' ? 'Galeria' :
               category === 'logo' ? 'Logo' : 'Geral'}
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
                        src={imageService.getPublicUrl(image.file_path)}
                        alt={image.file_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 space-y-2">
                      <p className="text-sm text-white truncate">{image.file_name}</p>
                      <div className="text-xs text-gray-400">
                        {formatFileSize(image.file_size)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {new Date(image.created_at).toLocaleDateString('pt-BR')}
                        </span>
                        <button
                          onClick={() => handleDelete(image.id, image.file_path)}
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
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma imagem nesta categoria</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}