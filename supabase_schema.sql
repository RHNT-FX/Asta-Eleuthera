-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. ARTICLES TABLE
create table public.articles (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  category text not null default 'Umum',
  thumbnail_url text,
  excerpt text,
  content text not null,
  is_published boolean default true,
  author_name text default 'Admin RT 27',
  views integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. MODULES TABLE
create table public.modules (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  category text not null default 'Modul',
  description text,
  file_url text not null,
  file_size text,
  download_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PROFILE SETTINGS TABLE (Key-Value store for profile data)
create table public.profile_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. GALLERY TABLE
create table public.gallery (
  id uuid default uuid_generate_v4() primary key,
  image_url text not null,
  caption text,
  category text default 'kegiatan',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SET UP ROW LEVEL SECURITY (RLS)

-- Enable RLS on all tables
alter table public.articles enable row level security;
alter table public.modules enable row level security;
alter table public.profile_settings enable row level security;
alter table public.gallery enable row level security;

-- Create policies for public access (Read Only)
create policy "Public can view published articles" on public.articles for select using (is_published = true);
create policy "Public can view modules" on public.modules for select using (true);
create policy "Public can view profile settings" on public.profile_settings for select using (true);
create policy "Public can view gallery" on public.gallery for select using (true);

-- Create policies for authenticated users (Admins can do everything)
-- Replace 'authenticated' with specific role checks if you have multiple user types
create policy "Admins can manage articles" on public.articles for all to authenticated using (true) with check (true);
create policy "Admins can manage modules" on public.modules for all to authenticated using (true) with check (true);
create policy "Admins can manage profile settings" on public.profile_settings for all to authenticated using (true) with check (true);
create policy "Admins can manage gallery" on public.gallery for all to authenticated using (true) with check (true);

-- Create Storage Buckets
insert into storage.buckets (id, name, public) values ('article-thumbnails', 'article-thumbnails', true);
insert into storage.buckets (id, name, public) values ('modules', 'modules', true);
insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true);

-- Storage Policies (Public Read, Admin Write)
create policy "Public can read thumbnails" on storage.objects for select using (bucket_id = 'article-thumbnails');
create policy "Public can read modules" on storage.objects for select using (bucket_id = 'modules');
create policy "Public can read gallery images" on storage.objects for select using (bucket_id = 'gallery');

create policy "Admins can insert thumbnails" on storage.objects for insert to authenticated with check (bucket_id = 'article-thumbnails');
create policy "Admins can insert modules" on storage.objects for insert to authenticated with check (bucket_id = 'modules');
create policy "Admins can insert gallery images" on storage.objects for insert to authenticated with check (bucket_id = 'gallery');

create policy "Admins can update thumbnails" on storage.objects for update to authenticated using (bucket_id = 'article-thumbnails');
create policy "Admins can update modules" on storage.objects for update to authenticated using (bucket_id = 'modules');
create policy "Admins can update gallery images" on storage.objects for update to authenticated using (bucket_id = 'gallery');

create policy "Admins can delete thumbnails" on storage.objects for delete to authenticated using (bucket_id = 'article-thumbnails');
create policy "Admins can delete modules" on storage.objects for delete to authenticated using (bucket_id = 'modules');
create policy "Admins can delete gallery images" on storage.objects for delete to authenticated using (bucket_id = 'gallery');
