begin;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.profiles (
 id uuid primary key references auth.users on delete cascade,
 display_name text not null default 'Abenteurer' check (char_length(display_name) between 1 and 60),
 created_at timestamptz not null default now()
);
create function public.create_profile() returns trigger language plpgsql security definer set search_path='' as $$
begin insert into public.profiles(id) values(new.id) on conflict do nothing; return new; end $$;
create trigger wyldo_profile after insert on auth.users for each row execute function public.create_profile();

insert into public.profiles(id) select id from auth.users on conflict do nothing;

create table public.quests(id uuid primary key, slug text unique not null);
create table public.quest_versions (
 id uuid primary key, quest_id uuid not null references public.quests, revision integer not null,
 status text not null check(status in ('draft','published','archived')),
 approval text not null check(approval in ('pending_source_review','approved')),
 field_ready boolean not null default false,
 document jsonb not null,
 unique(quest_id,revision)
);
create table public.stations(
 id uuid primary key, version_id uuid not null references public.quest_versions,
 ordinal integer not null check(ordinal between 1 and 8), title text not null,
 latitude double precision check(latitude between -90 and 90), longitude double precision check(longitude between -180 and 180),
 radius_m integer not null default 40 check(radius_m between 10 and 150),
 coordinate_status text not null check(coordinate_status in ('unverified','desk_checked','field_checked')),
 seal text check(seal in ('Mut','Neugier','Zuhören','Gemeinschaft')),
 content jsonb not null,
 unique(version_id,ordinal), check ((latitude is null) = (longitude is null))
);
create table public.dialogues(id text primary key, station_id uuid not null references public.stations, event text not null, ordinal integer not null, speaker text not null, text text not null, mood text not null, audio_asset text);
create table public.puzzles(station_id uuid primary key references public.stations, kind text not null, prompt text not null, options jsonb, hints jsonb not null, transcript text);
create table public.quest_assets(id text not null, version_id uuid not null references public.quest_versions, kind text not null, storage_path text, description text not null, primary key(version_id,id));
create table private.solutions(station_id uuid primary key references public.stations, accepted text[] not null);
create table private.station_feedback(station_id uuid primary key references public.stations, success text not null, hints jsonb not null);
create table public.quest_runs (
 id uuid primary key, user_id uuid not null references auth.users on delete cascade, version_id uuid not null references public.quest_versions,
 mode text not null check(mode in ('practice','field')),
 unlocked uuid[] not null default '{}', completed uuid[] not null default '{}', seals text[] not null default '{}',
 hints jsonb not null default '{}', attempts jsonb not null default '{}',
 finished boolean not null default false, awarded boolean not null default false,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(user_id,version_id,mode),
 check(not awarded or (finished and mode='field'))
);
create table public.station_progress(
 run_id uuid not null references public.quest_runs on delete cascade, station_id uuid not null references public.stations,
 completed_at timestamptz not null default now(), primary key(run_id,station_id)
);
create table public.earned_seals(run_id uuid not null references public.quest_runs on delete cascade, seal text not null, primary key(run_id,seal));
create table public.badge_awards(
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade,
 version_id uuid not null references public.quest_versions, quest_id uuid not null references public.quests, badge text not null default 'Hüter der Externsteine',
 awarded_at timestamptz not null default now(), unique(user_id,quest_id,badge)
);
create table private.operation_receipts(user_id uuid not null references auth.users on delete cascade, operation_id uuid not null, run_id uuid not null references public.quest_runs on delete cascade, response jsonb not null, primary key(user_id,operation_id));

create function public.is_published(v uuid) returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from public.quest_versions where id=v and status='published') $$;
revoke all on function public.is_published(uuid) from public;
grant execute on function public.is_published(uuid) to anon, authenticated;

revoke all on public.profiles,public.quests,public.quest_versions,public.stations,public.dialogues,public.puzzles,public.quest_assets,public.quest_runs,public.station_progress,public.earned_seals,public.badge_awards from anon,authenticated;

alter table public.profiles enable row level security;
create policy profile_read on public.profiles for select to authenticated using(id=auth.uid());
create policy profile_edit on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
grant select on public.profiles to authenticated;
grant update(display_name) on public.profiles to authenticated;

alter table public.quests enable row level security;
create policy quest_read on public.quests for select to anon,authenticated using(exists(select 1 from public.quest_versions v where v.quest_id=quests.id and v.status='published'));
alter table public.quest_versions enable row level security;
create policy version_read on public.quest_versions for select to anon,authenticated using(status='published');
alter table public.stations enable row level security;
create policy station_read on public.stations for select to anon,authenticated using(public.is_published(version_id));
alter table public.quest_assets enable row level security;
create policy asset_read on public.quest_assets for select to anon,authenticated using(public.is_published(version_id));
alter table public.puzzles enable row level security;
create policy puzzle_read on public.puzzles for select to anon,authenticated using(exists(select 1 from public.stations s where s.id=station_id and public.is_published(s.version_id)));
alter table public.dialogues enable row level security;
create policy dialogue_read on public.dialogues for select to anon,authenticated using(exists(select 1 from public.stations s where s.id=station_id and public.is_published(s.version_id)));
grant select on public.quests,public.quest_versions,public.stations,public.quest_assets,public.puzzles,public.dialogues to anon,authenticated;

alter table public.quest_runs enable row level security;
create policy run_read on public.quest_runs for select to authenticated using(user_id=auth.uid());
alter table public.station_progress enable row level security;
create policy progress_read on public.station_progress for select to authenticated using(exists(select 1 from public.quest_runs r where r.id=run_id and r.user_id=auth.uid()));
alter table public.earned_seals enable row level security;
create policy seal_read on public.earned_seals for select to authenticated using(exists(select 1 from public.quest_runs r where r.id=run_id and r.user_id=auth.uid()));
alter table public.badge_awards enable row level security;
create policy award_read on public.badge_awards for select to authenticated using(user_id=auth.uid());
grant select on public.quest_runs,public.station_progress,public.earned_seals,public.badge_awards to authenticated;
-- All progression writes go through the checked functions, including writes by the owner.
revoke insert,update,delete on public.quest_runs,public.station_progress,public.earned_seals,public.badge_awards from anon,authenticated;
revoke all on private.solutions,private.station_feedback,private.operation_receipts from public,anon,authenticated;

create function private.run_payload(r public.quest_runs) returns jsonb language sql stable set search_path='' as $$
 select jsonb_build_object('id',r.id,'userId',r.user_id,'versionId',r.version_id,'mode',r.mode,'unlocked',r.unlocked,'completed',r.completed,'seals',r.seals,'hints',r.hints,'attempts',r.attempts,'pending','[]'::jsonb,'finished',r.finished,'awarded',r.awarded,'updatedAt',floor(extract(epoch from r.updated_at)*1000));
$$;
create function public.start_quest(p_version uuid,p_run uuid,p_mode text) returns jsonb language plpgsql security definer set search_path='' as $$
declare r public.quest_runs; v public.quest_versions;
begin
 if auth.uid() is null then raise exception 'Anmeldung erforderlich.'; end if;
 if p_mode not in ('practice','field') then raise exception 'Ungültiger Modus.'; end if;
 select * into v from public.quest_versions where id=p_version and status='published';
 if not found then raise exception 'Quest ist noch nicht veröffentlicht.'; end if;
 if p_mode='field' and (not v.field_ready or v.approval<>'approved' or exists(select 1 from public.stations where version_id=p_version and (latitude is null or coordinate_status<>'field_checked'))) then raise exception 'Route noch nicht freigegeben.'; end if;
 if (select count(*) from public.stations where version_id=p_version)<>8 then raise exception 'Quest unvollständig.'; end if;
 insert into public.quest_runs(id,user_id,version_id,mode) values(p_run,auth.uid(),p_version,p_mode) on conflict(user_id,version_id,mode) do nothing;
 select * into r from public.quest_runs where user_id=auth.uid() and version_id=p_version and mode=p_mode;
 return private.run_payload(r);
end $$;

create function public.quest_command(p_run uuid,p_operation uuid,p_station uuid,p_kind text,p_answer text default null,p_fix jsonb default null,p_occurred_at bigint default null) returns jsonb language plpgsql security definer set search_path='' as $$
declare r public.quest_runs; s public.stations; saved jsonb; response jsonb; ok boolean:=true; n integer; d double precision; lat double precision; lon double precision; acc double precision; stamp double precision; event_time double precision; feedback jsonb;
begin
 if auth.uid() is null then raise exception 'Anmeldung erforderlich.'; end if;
 perform pg_advisory_xact_lock(hashtext(auth.uid()::text));
 select receipt.response into saved from private.operation_receipts receipt where receipt.user_id=auth.uid() and receipt.operation_id=p_operation and receipt.run_id=p_run;
 if found then return saved; end if;
 select * into r from public.quest_runs where id=p_run and user_id=auth.uid() for update;
 if not found then raise exception 'Abenteuer nicht gefunden.'; end if;
 if p_kind='finish' then
  if (select count(*) from public.stations where version_id=r.version_id)=8 and
     (select count(*) from public.station_progress sp join public.stations st on st.id=sp.station_id where sp.run_id=r.id and st.version_id=r.version_id)=8 and
     (select count(*) from public.earned_seals where run_id=r.id and seal in ('Mut','Neugier','Zuhören','Gemeinschaft'))=4 then
   r.finished:=true;
   if r.mode='field' then
    insert into public.badge_awards(user_id,version_id,quest_id) select r.user_id,r.version_id,v.quest_id from public.quest_versions v where v.id=r.version_id on conflict do nothing;
    r.awarded:=true;
   end if;
  else raise exception 'Es fehlen Stationen oder Steinsiegel.'; end if;
 else
  select * into s from public.stations where id=p_station and version_id=r.version_id;
  if not found then raise exception 'Station nicht gefunden.'; end if;
  if s.id=any(r.completed) then
   ok:=true;
  else
   if s.ordinal<>cardinality(r.completed)+1 then raise exception 'Vorherige Station noch offen.'; end if;
   if p_kind='unlock' then
    if not(s.id=any(r.unlocked)) then
     if r.mode='field' then
      if s.latitude is null or s.coordinate_status<>'field_checked' then raise exception 'Standort nicht freigegeben.'; end if;
      lat:=(p_fix->>'latitude')::double precision; lon:=(p_fix->>'longitude')::double precision; acc:=(p_fix->>'accuracy')::double precision; stamp:=(p_fix->>'timestamp')::double precision; event_time:=coalesce(p_occurred_at,extract(epoch from now())*1000);
      if lat is null or lon is null or acc is null or stamp is null or not(lat between -90 and 90) or not(lon between -180 and 180) or not(acc between 0 and least(50,s.radius_m)) or abs(event_time-stamp)>60000 or event_time<extract(epoch from r.created_at)*1000-5000 or event_time>extract(epoch from now())*1000+5000 or extract(epoch from now())*1000-event_time>604800000 then raise exception 'GPS ungültig, veraltet oder zu ungenau.'; end if;
      d:=6371000*2*asin(least(1,sqrt(power(sin(radians(lat-s.latitude)/2),2)+cos(radians(lat))*cos(radians(s.latitude))*power(sin(radians(lon-s.longitude)/2),2))));
      if d>s.radius_m then raise exception 'Außerhalb des Stationsradius.'; end if;
     end if;
     r.unlocked:=array_append(r.unlocked,s.id);
    end if;
   elsif p_kind in ('answer','hint') then
    if not(s.id=any(r.unlocked)) then raise exception 'Station noch gesperrt.'; end if;
    if p_kind='hint' then
     select jsonb_array_length(hints) into n from public.puzzles where station_id=s.id;
     r.hints:=jsonb_set(r.hints,array[s.id::text],to_jsonb(least(n,coalesce((r.hints->>s.id::text)::integer,0)+1)));
    else
     if p_answer is null or char_length(p_answer)>1000 then raise exception 'Antwort ungültig.'; end if;
     r.attempts:=jsonb_set(r.attempts,array[s.id::text],to_jsonb(coalesce((r.attempts->>s.id::text)::integer,0)+1));
     select lower(regexp_replace(trim(p_answer),'\s+',' ','g'))=any(accepted) into ok from private.solutions where station_id=s.id;
     ok:=coalesce(ok,false);
     if ok then
      r.completed:=array_append(r.completed,s.id);
      insert into public.station_progress(run_id,station_id) values(r.id,s.id) on conflict do nothing;
      if s.seal is not null then
       if not(s.seal=any(r.seals)) then r.seals:=array_append(r.seals,s.seal); end if;
       insert into public.earned_seals(run_id,seal) values(r.id,s.seal) on conflict do nothing;
      end if;
     end if;
    end if;
   else raise exception 'Unbekannte Aktion.'; end if;
  end if;
 end if;
 update public.quest_runs set unlocked=r.unlocked,completed=r.completed,seals=r.seals,hints=r.hints,attempts=r.attempts,finished=r.finished,awarded=r.awarded,updated_at=now() where id=r.id returning * into r;
 if p_station is not null and exists(select 1 from public.stations st where st.id=p_station and st.version_id=r.version_id) then
  select jsonb_build_object('stationId',p_station,'success',case when p_station=any(r.completed) then f.success else null end,'hints',coalesce((select jsonb_agg(h.value order by h.ordinality) from jsonb_array_elements(f.hints) with ordinality h(value,ordinality) where h.ordinality<=coalesce((r.hints->>p_station::text)::integer,0)),'[]'::jsonb)) into feedback from private.station_feedback f where f.station_id=p_station;
 end if;
 response:=jsonb_build_object('run',private.run_payload(r),'correct',ok,'feedback',feedback);
 insert into private.operation_receipts(user_id,operation_id,run_id,response) values(auth.uid(),p_operation,r.id,response);
 return response;
end $$;
create function public.get_quest_state(p_version uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare r public.quest_runs; feedback jsonb;
begin
 if auth.uid() is null then raise exception 'Anmeldung erforderlich.'; end if;
 select * into r from public.quest_runs where user_id=auth.uid() and version_id=p_version and mode='field';
 if not found then return null; end if;
 select coalesce(jsonb_agg(jsonb_build_object('stationId',f.station_id,'success',case when f.station_id=any(r.completed) then f.success else null end,'hints',coalesce((select jsonb_agg(h.value order by h.ordinality) from jsonb_array_elements(f.hints) with ordinality h(value,ordinality) where h.ordinality<=coalesce((r.hints->>f.station_id::text)::integer,0)),'[]'::jsonb))),'[]'::jsonb) into feedback
 from private.station_feedback f join public.stations st on st.id=f.station_id where st.version_id=r.version_id;
 return jsonb_build_object('run',private.run_payload(r),'feedback',feedback);
end $$;
revoke all on function public.get_quest_state(uuid) from public,anon,authenticated;
grant execute on function public.get_quest_state(uuid) to authenticated;
create function private.freeze_published_document() returns trigger language plpgsql set search_path='' as $$
begin
 if old.status<>'draft' and (new.document is distinct from old.document or new.revision<>old.revision or new.quest_id<>old.quest_id) then raise exception 'Published snapshots are immutable. Create a new quest version.'; end if;
 return new;
end $$;
create trigger freeze_published_quest before update on public.quest_versions for each row execute function private.freeze_published_document();
revoke all on function public.create_profile(),public.start_quest(uuid,uuid,text),public.quest_command(uuid,uuid,uuid,text,text,jsonb,bigint) from public;
grant execute on function public.start_quest(uuid,uuid,text),public.quest_command(uuid,uuid,uuid,text,text,jsonb,bigint) to authenticated;
commit;
