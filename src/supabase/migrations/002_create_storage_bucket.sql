-- Supabase Storage Bucket Setup for Lemon's Car

-- ============================================
-- 1. CRIAR BUCKET DE IMAGENS
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. CONFIGURAR POLÍTICAS DE ACESSO
-- ============================================

-- Permitir usuários autenticados fazer upload
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' AND
  auth.role() = 'authenticated'
);

-- Permitir acesso público para leitura
CREATE POLICY "Public access to images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Permitir admins deletar imagens
CREATE POLICY "Admins can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Permitir admins atualizar imagens
CREATE POLICY "Admins can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- 3. TABELA DE IMAGENS PARA RASTREAR UPLOADS
-- ============================================

CREATE TABLE IF NOT EXISTS public.image_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bucket_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INT NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('hero', 'service', 'gallery', 'logo', 'general')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.image_uploads ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Users can see all images"
ON public.image_uploads FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can upload image metadata"
ON public.image_uploads FOR INSERT
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Admins can manage all images"
ON public.image_uploads FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete image metadata"
ON public.image_uploads FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Índices
CREATE INDEX idx_image_uploads_category ON public.image_uploads(category);
CREATE INDEX idx_image_uploads_uploaded_by ON public.image_uploads(uploaded_by);
CREATE INDEX idx_image_uploads_created_at ON public.image_uploads(created_at DESC);
