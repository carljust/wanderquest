# Wyldo

Eine Outdoor-Abenteuer-App für iOS und Android mit Expo SDK 57, React Native, TypeScript und Supabase. Erste Quest: **„Der verlorene Schatz der Externsteine“**. Wyldo heißt auch der Fuchs. Kein Creator-Modus.

**Version 0.2.1:** Gestaltung nach dem gelieferten Mockup, Wyldo in vier Posen, Externsteine-/Wasser-/Runa-/Schatzillustrationen, vier Steinsiegel und eine Fortschrittsansicht. Alle acht Stationen sind im Entwicklungsmodus spielbar. Web und Smartphone verwenden eine echte OSM-Grundkarte ohne Google-Maps-Key. „Mit Google anmelden“ ist implementiert und für einen eigenen Development Build vorbereitet; die tatsächliche Google-/Supabase-Konfiguration ist noch offen. Eine freigegebene Outdoor-Route und ein Character-Rig fehlen weiterhin. [Prüfstand und Screenshots](docs/verification.md).

## Designreview – Phasen 1–3

Der Branch `feat/wyldo-adventure-design-review` enthält das neue Designsystem, Entdecken mit Suche/Filtern/Merkliste, Questdetails und Karte/Richtung nach `docs/wyldo_codex_designpaket_v1/`. [Änderungen, tatsächliche Prüfungen und Screenshots](docs/design-review.md) · [Direkter Bildvergleich](docs/design-review.html). Der weitere Ausbau wartet auf Designfreigabe. Die Questdetails zeigen Dauer, Strecke und Rätsel-Schwierigkeit direkt unter dem Bild sowie eine Sterneübersicht mit Durchschnitt und Bewertungsanzahl. Der Entwurf hat aktuell null Bewertungen; Dauer und Strecke sind noch nicht bestätigt.

Zum Prüfen dieses Standes im vorhandenen Checkout: eigene lokale Änderungen vorher sichern, `git fetch origin`, dann `git switch --track origin/feat/wyldo-adventure-design-review` (oder den bereits vorhandenen lokalen Branch mit `git switch feat/wyldo-adventure-design-review` öffnen). Danach `npm ci --include=dev` und `npm run start:phone`. Den nachfolgenden Main-Pull beim Branchreview auslassen.

Im Übungsmodus lautet der Einstieg jetzt **„Abenteuer entdecken“ → „Zum Startpunkt navigieren“**. Karte und Richtung sind umschaltbar; die klar beschriftete Simulation verändert nur die Vorschau. **„Zur Spielansicht“** öffnet den vorhandenen spielbaren Acht-Stationen-Ablauf mit „Ankunft simulieren“. „Quest pausieren“ kehrt zu Entdecken zurück; der bestehende Spielstand bleibt erhalten. Automatische Ankunft/Begrüßung und reguläres XP-System folgen erst nach Freigabe.

## Schnellstart in Codespaces oder auf dem Mac

Node **24.3–24.x** (Version in `.nvmrc`) und npm 11. In Codespaces braucht dein Mac kein Node: alle folgenden Befehle laufen im Codespaces-Terminal.

```bash
cd /workspaces/wanderquest
# Bei einer vorhandenen Installation zunächst den alten Expo-Prozess mit Ctrl+C beenden.
git pull --ff-only origin main
npm ci --include=dev
npm run start:phone
```

Auf dem Mac stattdessen in den lokalen Repositoryordner wechseln. Expo Go muss SDK **57** unterstützen. `start:phone` erzwingt Expo Go und startet den ngrok-Tunnel mit geleertem Metro-Cache. Den **neu erzeugten QR-Code** verwenden und die alte laufende App schließen. Kein zusätzliches `ngrok` anhängen. `EXPO_OFFLINE` darf beim Tunnelstart nicht gesetzt sein; Codespaces muss ausgehende ngrok-Verbindungen zulassen.

Falls `git pull` wegen eines lokal veränderten `package-lock.json` stoppt: die eigene Änderung zuerst sichern, etwa mit `git stash push -m "Lokales Lockfile vor Wyldo-Update" -- package-lock.json`, und dann erneut aktualisieren. Das aktuelle Projekt immer mit `npm ci` installieren.

Auf der Anmeldung **„Ohne Konto im Entwicklungsmodus testen“**, danach die Questdetails öffnen (auf dem Designreview-Branch den oben beschriebenen Navigationseinstieg nutzen). An jeder Station ersetzt **„Ankunft simulieren“** den Aufenthalt vor Ort. Rätsel, zwei Hinweise je Aufgabe, vier Siegel und Finale lassen sich durchspielen. Im Profil kannst du den Lauf zurücksetzen. Bei einem echten angemeldeten Konto führt **„Quest im Übungsmodus öffnen“** ebenfalls zum Testlauf, falls noch keine Live-Quest freigegeben ist. Übung und Konto bleiben getrennt; simulierte Läufe erhalten kein reguläres Abzeichen.

Lokal im selben WLAN geht auch `npm start -- --go`. Browser: `npm run web`.

## Supabase einrichten

`.env.example` bei der Ersteinrichtung nach `.env.local` kopieren; eine vorhandene Datei mit eigenem Key erhalten. Alternativ die Werte sicher als Umgebungsvariablen hinterlegen:

```dotenv
EXPO_PUBLIC_SUPABASE_URL=https://rxkvdixavsrakbtmnsao.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
EXPO_PUBLIC_ENABLE_DEV_MODE=true
```

Den **öffentlichen Publishable-Key** aus den Supabase-Projekteinstellungen verwenden; ein öffentlicher Anon-Key ist ebenfalls geeignet. Niemals Service-Role-Key, Secret-Key oder Datenbankpasswort in `EXPO_PUBLIC_*` oder den Client schreiben. `.env.local` ist ignoriert. Nach Änderungen Expo neu starten. Der öffentliche Client-Key ist bestimmungsgemäß Bestandteil der App; die Daten schützt RLS.

Im SQL Editor des eigenen Projekts in dieser Reihenfolge anwenden:

1. `supabase/migrations/202610160001_wyldo.sql`
2. `supabase/migrations/202610160002_storage.sql`
3. `supabase/seed.sql`

Migrationen einmal ausführen. Der Seed ist für dieselbe unveröffentlichte Entwurfsversion wiederholt ausführbar. Nach Veröffentlichung braucht eine Inhaltsänderung eine neue Versions-ID. E-Mail/Passwort, E-Mail-Bestätigung und mindestens zwölf Zeichen als Passwortpolicy im Dashboard einstellen. Für Bestätigung/Reset die tatsächlich verwendeten App-/Web-Rücksprungadressen erlauben; eigener Build: `wyldo://auth/callback`, Reset zusätzlich `?next=reset`. Expo-Go-Links hängen von der aktuellen Entwicklungsadresse ab. Bestätigungs-/PKCE-Link auf demselben Gerät und in derselben App öffnen.

**Die Live-Liste bleibt nach dem Seed leer:** Die Outdoor-Route wurde noch nicht freigegeben, der Seed bleibt `draft`. Nur der klar gekennzeichnete Entwicklungsmodus lädt die lokale Quest. Die Gestaltung und Karte sind davon unabhängig verfügbar; echte Feldläufe bleiben gesperrt.

## Mit Google anmelden

Die Schaltfläche registriert beim ersten erfolgreichen Google-Login zugleich einen Supabase-Benutzer. Kein eigenes Passwort nötig, kein Zugriff auf Gmail-Nachrichten.

Google muss in Supabase aktiviert und mit einem Google OAuth-Webclient verbunden werden. Dessen Redirect ist `https://rxkvdixavsrakbtmnsao.supabase.co/auth/v1/callback`. Client-Secret ausschließlich im Supabase-Dashboard eintragen. Eigene App-/Web-Callbacks zusätzlich in Supabase erlauben.

**Für Google auf dem Smartphone ist ein Development Build nötig.** Expo Go bleibt für Quest, Karten und Übungsmodus nutzbar. `eas.json`, `expo-dev-client` und das `wyldo://`-Schema sind vorbereitet. Nach Installation eines eigenen Builds mit `npm run start:dev` starten. Es wurde kein EAS-Build und kein kostenpflichtiger Dienst gestartet.

Vollständige Einrichtung, mögliche Buildkosten und offener Gerätetest: [Google-Anmeldung](docs/google-login.md).

## Aufbau und Inhalte

```text
src/domain/               Questzustände, Reihenfolge, GPS-Regeln
src/features/auth/        Session, sicherer nativer Tokenspeicher, Google/PKCE
src/features/quest/       Supabase-Abfragen und Anwendungskontext
src/features/map/         Leaflet/WebView, Kartenfehler und Vordergrund-GPS
src/features/dialogue/    Untertitel, Sprache und Audio-Lebenszyklus
src/features/companion/   Austauschbarer Wyldo-Renderer
src/features/offline/     Mediencache, Spielstand und Synchronisierung
src/app/                  Expo-Router-Ansichten
assets/design/            Wyldo, Szenen und Steinsiegel mit Herkunftsnachweis
content/                  Questentwurf, Quellen und private Seed-/Testlösungen
supabase/                 Migrationen und generierter Seed
```

Die Geschichte bleibt bei Schatzkarte, Runa, vier Steinsiegeln und Kristallfinale. Die beigefügte JSON-Datei mit fünf Alva-/Sternenkompass-Stationen ist als Quellenreferenz archiviert; ihre widersprechende Handlung wurde entsprechend der ausdrücklichen Vorgabe nicht übernommen. Die ergänzten Szenen sind Illustrationen, keine dokumentarischen Fotos. Die Figur verwendet Ganzbildposen und begrenzte Bewegung; noch kein Blinzeln, animierter Mund oder Rive-Rig.

Inhalte ändern: `content/externsteine.v1.json` und `content/solutions.private.json`, danach `npm run seed:generate`. Questtexte bleiben aus den UI-Komponenten heraus. Lösungen, Erfolgsdialoge und neue Hinweisstufen liegen im Backend privat. Lokale Lösungen werden ausschließlich in Entwicklungsbundles geladen; Release-Bundles deaktivieren Übung zusätzlich über `__DEV__`.

## Prüfen

```bash
npm run check            # TypeScript, ESLint und Jest
npm run test:database    # PostgreSQL/RLS/RPC mit PGlite, ohne externes Konto
npm run test:web         # Acht Stationen, Offline, kleine Ansicht, Karten/Bridge
npm run export:web
npm run check:release
npm run export:native    # iOS-/Android-Hermes, keine signierten Apps
npm run format:check
```

Playwright benötigt Chromium: `npx playwright install chromium` oder `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` setzen. In dieser Cloud: `/usr/bin/chromium`. Der Browser berücksichtigt einen vorhandenen HTTPS-Proxy, TLS-Prüfung bleibt aktiv. Tests verwenden synthetische Accounts/Koordinaten und verändern das echte Supabase-Projekt nicht.

Leaflet stammt aus dem installierten Paket; nach einem Versionswechsel `npm run map:generate` ausführen. Die native WebView benötigt keinen JavaScript-CDN-Zugriff. OSM-Kacheln benötigen Internet und sichtbare Attribution. Keine Offline-Karten, kein Kachel-Massendownload, kein Google-Maps-Key. Öffentliche OSM-Infrastruktur hat keine Verfügbarkeitsgarantie; vor größerem Betrieb Anbieter und [Nutzungsrichtlinie](https://operations.osmfoundation.org/policies/tiles/) prüfen. Supabase hat tarifabhängige Limits. GPS, Stimmen, Deep Links, Tastatur, Tokenpersistenz und WebView müssen zusätzlich auf echten iOS-/Android-Geräten geprüft werden.

[Backend](docs/backend.md) · [Quellen und Route](docs/route-review.md) · [Figur und Animation](docs/companion.md) · [Offline](docs/offline.md) · [Prüfbericht und Screenshots](docs/verification.md)
