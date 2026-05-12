create extension if not exists "pgcrypto";

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_filename text not null,
  source_summary text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  question text not null,
  answer text not null,
  explanation text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.study_sets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.study_set_lessons (
  id uuid primary key default gen_random_uuid(),
  study_set_id uuid not null references public.study_sets(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (study_set_id, lesson_id)
);

create index if not exists idx_cards_lesson_id on public.cards(lesson_id);
create index if not exists idx_study_set_lessons_set_id on public.study_set_lessons(study_set_id);
create index if not exists idx_study_set_lessons_lesson_id on public.study_set_lessons(lesson_id);

alter table public.lessons disable row level security;
alter table public.cards disable row level security;
alter table public.study_sets disable row level security;
alter table public.study_set_lessons disable row level security;
