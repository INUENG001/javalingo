-- Javalingo schema for Supabase. Run this file in Supabase SQL Editor.
-- Public profile fields are intentionally limited to username + total_xp.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username text not null unique,
    total_xp integer not null default 0 check (total_xp >= 0),
    created_at timestamptz not null default now()
);

create table if not exists public.user_progress (
    user_id uuid not null references auth.users(id) on delete cascade,
    lesson_id text not null,
    score integer not null default 0 check (score >= 0),
    max_score integer not null default 5 check (max_score > 0),
    completed boolean not null default false,
    attempts integer not null default 0 check (attempts >= 0),
    updated_at timestamptz not null default now(),
    primary key (user_id, lesson_id)
);

create index if not exists user_progress_user_id_idx on public.user_progress(user_id);
create index if not exists profiles_total_xp_idx on public.profiles(total_xp desc);

-- Create a public profile automatically whenever a new Auth user signs up.
create or replace function public.handle_new_javalingo_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
    desired_username text;
begin
    desired_username := lower(regexp_replace(
        coalesce(new.raw_user_meta_data ->> 'username', split_part(coalesce(new.email, 'coder'), '@', 1)),
        '[^a-zA-Z0-9ก-๙_-]', '', 'g'
    ));
    if length(desired_username) < 3 then
        desired_username := 'coder_' || left(new.id::text, 6);
    end if;

    insert into public.profiles (id, username, total_xp)
    values (new.id, desired_username || '_' || left(new.id::text, 4), 0)
    on conflict (id) do nothing;

    return new;
end;
$$;
revoke all on function public.handle_new_javalingo_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_javawave on auth.users;
drop trigger if exists on_auth_user_created_javalingo on auth.users;
create trigger on_auth_user_created_javalingo
after insert on auth.users
for each row execute procedure public.handle_new_javalingo_user();

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;

-- Explicit grants: the leaderboard only needs these public profile fields.
revoke all on table public.profiles from anon, authenticated;
grant select (id, username, total_xp, created_at) on table public.profiles to anon, authenticated;
grant update (username) on table public.profiles to authenticated;

revoke all on table public.user_progress from anon, authenticated;
grant select on table public.user_progress to authenticated;

-- The leaderboard displays public usernames and XP only.
drop policy if exists "Public profiles can be viewed" on public.profiles;
create policy "Public profiles can be viewed"
on public.profiles for select
to anon, authenticated
using (true);

drop policy if exists "Users can update their own username" on public.profiles;
create policy "Users can update their own username"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "Users can read their own progress" on public.user_progress;
create policy "Users can read their own progress"
on public.user_progress for select
to authenticated
using ((select auth.uid()) = user_id);

-- All writes to progress and XP go through this checked RPC, not direct table writes.
create or replace function public.complete_lesson(
    p_lesson_id text,
    p_score integer,
    p_max_score integer
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
    current_user_id uuid := auth.uid();
    was_completed boolean := false;
    now_completed boolean := false;
    awarded_xp integer := 0;
    best_score integer := 0;
begin
    if current_user_id is null then
        raise exception 'Authentication required';
    end if;

    if p_lesson_id not in ('java-basics', 'variables', 'conditions', 'loops', 'oop-classes', 'oop-inheritance') then
        raise exception 'Unknown lesson';
    end if;
    if p_max_score <> 5 or p_score < 0 or p_score > p_max_score then
        raise exception 'Invalid score';
    end if;

    -- Insert a placeholder first, then lock the row to avoid awarding XP twice
    -- if two requests for the same lesson arrive at nearly the same time.
    insert into public.user_progress (user_id, lesson_id, score, max_score, completed, attempts, updated_at)
    values (current_user_id, p_lesson_id, 0, p_max_score, false, 0, now())
    on conflict (user_id, lesson_id) do nothing;

    select completed into was_completed
    from public.user_progress
    where user_id = current_user_id and lesson_id = p_lesson_id
    for update;

    now_completed := p_score >= 3;
    update public.user_progress
    set score = greatest(score, p_score),
        max_score = p_max_score,
        completed = completed or now_completed,
        attempts = attempts + 1,
        updated_at = now()
    where user_id = current_user_id and lesson_id = p_lesson_id
    returning score into best_score;

    if now_completed and not coalesce(was_completed, false) then
        awarded_xp := case p_lesson_id
            when 'java-basics' then 25
            when 'variables' then 30
            when 'conditions' then 35
            when 'loops' then 40
            when 'oop-classes' then 50
            when 'oop-inheritance' then 60
            else 0
        end;
    end if;

    if awarded_xp > 0 then
        update public.profiles
        set total_xp = total_xp + awarded_xp
        where id = current_user_id;
    end if;

    return jsonb_build_object(
        'lesson_id', p_lesson_id,
        'score', p_score,
        'best_score', best_score,
        'completed', now_completed or coalesce(was_completed, false),
        'xp_earned', awarded_xp,
        'pass_mark', 3
    );
end;
$$;

revoke all on function public.complete_lesson(text, integer, integer) from public, anon;
grant execute on function public.complete_lesson(text, integer, integer) to authenticated;

-- Note: Supabase Auth email confirmation settings are controlled in the Supabase dashboard.
