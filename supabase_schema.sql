
-- ==========================================
-- KAS & SIMPAN PINJAM (KOPERASI RT)
-- ==========================================

create table public.koperasi_warga (
  id uuid default uuid_generate_v4() primary key,
  nama text not null,
  nik text,
  no_hp text,
  blok_rumah text,
  total_simpanan numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.koperasi_transaksi (
  id uuid default uuid_generate_v4() primary key,
  warga_id uuid references public.koperasi_warga(id) on delete cascade,
  jenis text not null check (jenis in ('wajib', 'sukarela', 'tarik')),
  jumlah numeric not null,
  keterangan text,
  tanggal timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.koperasi_pinjaman (
  id uuid default uuid_generate_v4() primary key,
  warga_id uuid references public.koperasi_warga(id) on delete cascade,
  jumlah_pinjaman numeric not null,
  bunga_persen numeric default 0,
  tenor_bulan integer not null,
  sisa_tagihan numeric not null,
  status text default 'aktif' check (status in ('aktif', 'lunas', 'macet')),
  tanggal_pinjam timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.koperasi_angsuran (
  id uuid default uuid_generate_v4() primary key,
  pinjaman_id uuid references public.koperasi_pinjaman(id) on delete cascade,
  jumlah_bayar numeric not null,
  tanggal_bayar timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.koperasi_warga enable row level security;
alter table public.koperasi_transaksi enable row level security;
alter table public.koperasi_pinjaman enable row level security;
alter table public.koperasi_angsuran enable row level security;

create policy "Admins can manage koperasi" on public.koperasi_warga for all to authenticated using (true) with check (true);
create policy "Admins can manage koperasi trx" on public.koperasi_transaksi for all to authenticated using (true) with check (true);
create policy "Admins can manage koperasi pinjaman" on public.koperasi_pinjaman for all to authenticated using (true) with check (true);
create policy "Admins can manage koperasi angsuran" on public.koperasi_angsuran for all to authenticated using (true) with check (true);
