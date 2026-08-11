-- Table untuk Profile Settings
CREATE TABLE IF NOT EXISTS public.profile_settings (
    key text PRIMARY KEY,
    value jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;

-- Policy untuk profile_settings
DROP POLICY IF EXISTS "Public can read profile settings" ON public.profile_settings;
CREATE POLICY "Public can read profile settings"
ON public.profile_settings
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage profile settings" ON public.profile_settings;
CREATE POLICY "Authenticated users can manage profile settings"
ON public.profile_settings
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Table untuk Gallery
CREATE TABLE IF NOT EXISTS public.gallery (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url text NOT NULL,
    caption text,
    category text DEFAULT 'kegiatan',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Policy untuk gallery
DROP POLICY IF EXISTS "Public can read gallery" ON public.gallery;
CREATE POLICY "Public can read gallery"
ON public.gallery
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage gallery" ON public.gallery;
CREATE POLICY "Authenticated users can manage gallery"
ON public.gallery
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
