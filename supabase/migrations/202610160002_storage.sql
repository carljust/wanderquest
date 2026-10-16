begin;
insert into storage.buckets(id,name,public) values('quest-assets','quest-assets',false) on conflict(id) do nothing;
create policy published_quest_asset_read on storage.objects for select to anon,authenticated using(
 bucket_id='quest-assets' and exists(select 1 from public.quest_assets a where a.storage_path=name and public.is_published(a.version_id))
);
-- Players never upload or modify quest assets. Use an administrative migration/upload process.
commit;
