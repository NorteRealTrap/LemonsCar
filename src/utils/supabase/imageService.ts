import { supabase } from './client';

interface ImageUploadOptions {
  file: File;
  category: 'hero' | 'service' | 'gallery' | 'logo' | 'general';
  description?: string;
}

interface UploadedImage {
  id: string;
  url: string;
  path: string;
  name: string;
  size: number;
}

export const imageService = {
  /**
   * Upload de imagem para o Supabase Storage
   */
  async uploadImage(options: ImageUploadOptions): Promise<UploadedImage> {
    const { file, category, description } = options;

    // Validação
    if (!file.type.startsWith('image/')) {
      throw new Error('O arquivo deve ser uma imagem');
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Arquivo muito grande. Máximo: 5MB');
    }

    // Gerar nome único
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const fileName = `${category}/${timestamp}-${random}-${file.name}`;

    try {
      // Upload para storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Obter URL pública
      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      const { data: user } = await supabase.auth.getUser();

      // Registrar metadata no banco de dados
      const { data: imageData, error: dbError } = await supabase
        .from('image_uploads')
        .insert({
          bucket_name: 'images',
          file_path: fileName,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: user?.user?.id,
          category,
          description,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return {
        id: imageData.id,
        url: publicUrlData.publicUrl,
        path: fileName,
        name: file.name,
        size: file.size,
      };
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }
  },

  /**
   * Buscar imagens por categoria
   */
  async getImagesByCategory(
    category: 'hero' | 'service' | 'gallery' | 'logo' | 'general'
  ) {
    try {
      const { data, error } = await supabase
        .from('image_uploads')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar imagens:', error);
      throw error;
    }
  },

  /**
   * Deletar imagem (apenas para admins)
   */
  async deleteImage(imageId: string, filePath: string): Promise<void> {
    try {
      // Deletar do storage
      const { error: storageError } = await supabase.storage
        .from('images')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Deletar metadata
      const { error: dbError } = await supabase
        .from('image_uploads')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      throw error;
    }
  },

  /**
   * Obter URL pública de uma imagem
   */
  getPublicUrl(filePath: string): string {
    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
  },

  /**
   * Buscar todas as imagens
   */
  async getAllImages() {
    try {
      const { data, error } = await supabase
        .from('image_uploads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar imagens:', error);
      throw error;
    }
  },
};
