-- Supabase SQL エディタまたは migration で実行してください。
-- 公開読み取り・匿名投稿用 RLS（本番では用途に合わせて厳格化してください）。

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  salary_man integer,
  created_at timestamptz not null default now()
);

create index if not exists jobs_created_at_idx on public.jobs (created_at desc);
create index if not exists jobs_category_idx on public.jobs (category);
create index if not exists jobs_salary_man_idx on public.jobs (salary_man);

alter table public.jobs enable row level security;

create policy "jobs_select_anon"
  on public.jobs for select
  to anon, authenticated
  using (true);

create policy "jobs_insert_anon"
  on public.jobs for insert
  to anon, authenticated
  with check (true);

-- API（PostgREST）のスキーマキャッシュを更新（テーブル作成直後のエラー回避）
notify pgrst, 'reload schema';
