import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
const db = new PGlite();
let assertions = 0;
const check = (condition, label) => {
  assert.ok(condition, label);
  assertions++;
  console.log("PASS " + label);
};
const reject = async (job, label) => {
  await assert.rejects(job);
  assertions++;
  console.log("PASS " + label);
};
const query = (sql, args = []) => db.query(sql, args);
const admin = () => db.exec("reset role");
const user = async (id) => {
  await admin();
  await query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
  await db.exec("set role authenticated");
};
const v = "e2000000-0000-4000-8000-000000000001";
const uid = "a1000000-0000-4000-8000-000000000001";
const other = "a1000000-0000-4000-8000-000000000002";
const stations = JSON.parse(
  readFileSync("content/externsteine.v1.json", "utf8"),
).stations;
const answers = JSON.parse(
  readFileSync("content/solutions.private.json", "utf8"),
);
const start = async (mode) =>
  (
    await query("select public.start_quest($1,$2,$3) as result", [
      v,
      randomUUID(),
      mode,
    ])
  ).rows[0].result;
const command = async (
  run,
  s,
  kind,
  answer = null,
  fix = null,
  id = randomUUID(),
  time = Date.now(),
) =>
  (
    await query("select public.quest_command($1,$2,$3,$4,$5,$6,$7) as result", [
      run,
      id,
      s,
      kind,
      answer,
      fix,
      time,
    ])
  ).rows[0].result;
try {
  await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;
 create schema storage;create table storage.buckets(id text primary key,name text,public boolean);create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;grant usage on schema storage to anon,authenticated;grant select on storage.objects to anon,authenticated;`);
  for (const file of [
    "supabase/migrations/202610160001_wyldo.sql",
    "supabase/migrations/202610160002_storage.sql",
    "supabase/seed.sql",
    "supabase/seed.sql",
  ])
    await db.exec(readFileSync(file, "utf8"));
  check(
    (await query("select count(*)::int n from public.stations")).rows[0].n ===
      8,
    "repeatable seed contains exactly eight stations",
  );
  await query("insert into auth.users(id) values($1),($2)", [uid, other]);
  await user(uid);
  check(
    (await query("select count(*)::int n from public.profiles")).rows[0].n ===
      1,
    "profile trigger and own-profile RLS",
  );
  check(
    (await query("select count(*)::int n from public.quest_versions")).rows[0]
      .n === 0,
    "draft is not readable by players",
  );
  await reject(
    () => query("select * from private.solutions"),
    "answers inaccessible to authenticated player",
  );
  await reject(() => start("field"), "unpublished quest cannot be started");
  await admin();
  await query("update public.quest_versions set status='published'");
  await user(uid);
  await reject(
    () => start("field"),
    "unverified route cannot be started in field mode",
  );
  await reject(
    () => query("update public.quest_versions set field_ready=true"),
    "players cannot publish or alter content",
  );
  await reject(
    () => query("update public.profiles set created_at=now()"),
    "profile fields are restricted",
  );
  const document = (await query("select document from public.quest_versions"))
    .rows[0].document;
  check(
    document.stations.every(
      (s) =>
        s.success === "" && s.puzzle.hints.every((h) => !h.includes("2413")),
    ),
    "public snapshot omits answer-revealing success and hints",
  );
  await reject(
    () => query("select * from private.station_feedback"),
    "unrequested hints and success dialogues are private",
  );
  const practice = await start("practice");
  await reject(
    () => command(practice.id, null, "finish"),
    "early completion is rejected",
  );
  for (const s of stations) {
    await command(practice.id, s.id, "unlock");
    await command(practice.id, s.id, "answer", answers[s.id][0]);
  }
  const p = await command(practice.id, null, "finish");
  check(
    p.run.finished && !p.run.awarded,
    "completed practice run receives no regular award",
  );
  check(
    (await query("select count(*)::int n from public.badge_awards")).rows[0]
      .n === 0,
    "no practice badge exists",
  );
  await admin();
  await query(
    "update public.quest_versions set approval='approved',field_ready=true",
  );
  await query(
    "update public.stations set latitude=0,longitude=0,coordinate_status='field_checked'",
  );
  // Synthetic test coordinates only, never written to the real quest seed.
  await user(uid);
  const field = await start("field");
  await admin();
  await query(
    "update public.quest_runs set created_at=now()-interval '3 hours' where id=$1",
    [field.id],
  );
  await user(uid);
  await user(other);
  check(
    (await query("select public.get_quest_state($1) state", [v])).rows[0]
      .state === null,
    "state RPC cannot read another user",
  );
  check(
    (await query("select count(*)::int n from public.quest_runs")).rows[0].n ===
      0,
    "other users cannot read runs",
  );
  await reject(
    () => command(field.id, stations[0].id, "unlock"),
    "other users cannot change runs",
  );
  await user(uid);
  await reject(
    () => query("update public.quest_runs set awarded=true"),
    "direct progress/badge forgery is rejected",
  );
  const fix = () => ({
    latitude: 0,
    longitude: 0,
    accuracy: 5,
    timestamp: Date.now(),
  });
  await reject(
    () => command(field.id, stations[1].id, "unlock", null, fix()),
    "station ordering is enforced",
  );
  await reject(
    () =>
      command(field.id, stations[0].id, "unlock", null, {
        ...fix(),
        accuracy: 200,
      }),
    "inaccurate GPS cannot unlock",
  );
  await reject(
    () =>
      command(field.id, stations[0].id, "unlock", null, {
        ...fix(),
        latitude: 1,
      }),
    "out-of-radius GPS cannot unlock",
  );
  await reject(
    () =>
      command(field.id, stations[0].id, "unlock", null, {
        ...fix(),
        timestamp: 1,
      }),
    "stale GPS cannot unlock",
  );
  for (const s of stations) {
    if (s.order === 1) {
      const recorded = Date.now() - 7200000;
      const offline = await command(
        field.id,
        s.id,
        "unlock",
        null,
        { ...fix(), timestamp: recorded },
        randomUUID(),
        recorded,
      );
      check(
        offline.run.unlocked.includes(s.id),
        "offline GPS event captured two hours ago synchronizes",
      );
    } else await command(field.id, s.id, "unlock", null, fix());
    if (s.order === 1) {
      const before = (
        await query("select public.get_quest_state($1) state", [v])
      ).rows[0].state;
      check(
        before.feedback.every(
          (f) => f.success === null && f.hints.length === 0,
        ),
        "future feedback is not revealed by state RPC",
      );
      const hint = await command(field.id, s.id, "hint");
      check(
        hint.feedback.hints.length === 1 && hint.feedback.success === null,
        "hint RPC reveals only the requested tier",
      );
      check(hint.run.hints[s.id] === 1, "tiered hints are tracked");
      const id = randomUUID();
      const wrong = await command(field.id, s.id, "answer", "wrong", null, id);
      const repeated = await command(
        field.id,
        s.id,
        "answer",
        "wrong",
        null,
        id,
      );
      check(
        !wrong.correct && wrong.run.completed.length === 0,
        "wrong answer does not complete station",
      );
      check(
        repeated.run.attempts[s.id] === 1,
        "replayed operation is idempotent",
      );
    }
    const response = await command(field.id, s.id, "answer", answers[s.id][0]);
    check(
      response.correct && response.feedback.success.length > 0,
      "server validates station " + s.order,
    );
  }
  const finished = await command(field.id, null, "finish");
  await command(field.id, null, "finish");
  check(
    finished.run.awarded && finished.run.seals.length === 4,
    "eight verified stations and four seals produce award",
  );
  check(
    (await query("select count(*)::int n from public.badge_awards")).rows[0]
      .n === 1,
    "repeated finish creates exactly one badge",
  );
  await admin();
  await query(
    "update public.quest_assets set storage_path='test/image.png' where id='station-1'",
  );
  await query(
    "insert into storage.objects(bucket_id,name) values('quest-assets','test/image.png'),('quest-assets','not-referenced.png')",
  );
  await user(uid);
  check(
    (await query("select count(*)::int n from storage.objects")).rows[0].n ===
      1,
    "Storage exposes only referenced published assets",
  );
  await admin();
  await db.exec("set role anon");
  check(
    (await query("select count(*)::int n from public.quest_versions")).rows[0]
      .n === 1,
    "published content is readable without modifying it",
  );
  await reject(
    () => query("select * from private.solutions"),
    "anonymous queries cannot expose solutions",
  );
  console.log(
    `\n${assertions} PostgreSQL assertions passed (PGlite; Supabase Auth/API integration not exercised).`,
  );
} finally {
  await db.close();
}
