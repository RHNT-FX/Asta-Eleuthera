-- Tabel Artikel Berita
CREATE TABLE public.articles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    category text DEFAULT 'Umum',
    thumbnail_url text,
    excerpt text,
    content text NOT NULL,
    is_published boolean DEFAULT true,
    views integer DEFAULT 0,
    author_name text DEFAULT 'Admin RT',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Siapapun bisa membaca artikel yang sudah dipublish
CREATE POLICY "Public can read published articles" 
ON public.articles 
FOR SELECT 
USING (is_published = true);

-- Admin (authenticated) bisa melakukan semuanya (CRUD)
CREATE POLICY "Authenticated users can do all" 
ON public.articles 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
