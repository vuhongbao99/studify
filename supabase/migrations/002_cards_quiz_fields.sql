-- Quiz-style cards: multiple choice + true/false; legacy flashcards use question_type = 'open'
alter table public.cards
  add column if not exists question_type text not null default 'open';

alter table public.cards
  add column if not exists options jsonb;

comment on column public.cards.question_type is 'open | mcq | true_false';
comment on column public.cards.options is 'JSON array of 4 option strings for mcq; null otherwise';
