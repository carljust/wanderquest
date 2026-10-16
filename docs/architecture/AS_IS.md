# Bestand · Phase 1

Stand: 16.10.2026, Branch `feat/wyldo-adventure-design-review`, Ausgangscommit `af18c7e`. Der neue [Auftrag für Phase 1 und 2](../reviews/phase-1-2-request.md) ersetzt die ältere Phasennummerierung. Bestehende Spiel- und Backendfunktionen sind Bestand, keine neu freigegebene Phase 3.

## Unterlagen und Vorrang

Die angefragten Pfade `docs/specs/PFLICHTENHEFT.md` und `docs/design/wyldo-v1/` fehlen auch im abrufbaren GitHub-Stand. Tatsächlich vorhanden: [Pflichtenheft](../PFLICHTENHEFT.md) und [Designpaket](../wyldo_codex_designpaket_v1/README.md), wie vom Nutzer bereits korrigiert. Produktkonzept, Designsystem, Screenvertrag, Abnahme, Auftrag und Mockups wurden geprüft. Originaldateien bleiben erhalten.

Die jüngste helle Übersicht im Chat hat für Entdecken Vorrang vor dem dunklen ersten Mockup. Wyldo bleibt der orange Fuchs; „OpenQuest“ und dessen grünes Maskottchen werden nicht übernommen. Für Details und Richtung gilt das v1-Paket. Dessen fünfteilige Alva-/Sternenkompass-JSON ersetzt nicht die beauftragte achtteilige Schatzgeschichte. Mockup-Zahlen sind keine freigegebenen Routen- oder Belohnungsdaten.

## Technik und Verantwortlichkeiten

| Bereich      | Konkreter Bestand                                                                                                                                         | Grenze                                                                           |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Laufzeit     | Expo `~57.0.30`, RN `0.86.3`, React `19.2.3`, TS `~6.0.3`; Node 24.3–24.x, npm 11, Lockfile                                                               | Keine SDK-Migration erforderlich                                                 |
| Routing      | `src/app/_layout.tsx`, Expo Router; geschützte Tabs und Questgruppe                                                                                       | Nach Anmeldung Entdecken; keine Creator-Route                                    |
| Auth         | `features/auth/`: E-Mail/Passwort, Registrierung, Reset, Google-PKCE, sichere native Session                                                              | Öffentlicher Supabase-Key/Provider fehlen; kein Live-Nachweis                    |
| Questdaten   | `features/quest/repository.ts`, `domain/quest.ts`; veröffentlichte versionierte JSON aus Supabase, Entwicklungsfassung aus `content/externsteine.v1.json` | Eine Quest; noch kein Katalog mit räumlicher Suche                               |
| Zustand      | `features/quest/provider.tsx`, `domain/engine.ts`; Reihenfolge, Freischaltung, Rätsel, Hinweise, Siegel, Abschluss                                        | Kein vollständiger persistierter Navigations-/Intro-/Pauseautomat                |
| Datenbank    | Zwei Migrationen; Profile, Versionen, Stationen, Dialoge, Rätsel, Assets, Runs, Fortschritt, Siegel, Abzeichen; private Lösungen und RPCs                 | Lokal mit PGlite geprüft, keine Remote-Migration durchgeführt                    |
| Offline      | `features/offline/`: kontogetrennter AsyncStorage-Snapshot, Mediencache, serielle Outbox und idempotente Synchronisierung                                 | Feldsynchronisation nicht gegen echtes Supabase getestet; keine Offline-Karten   |
| Karte        | Leaflet 1.9.4: Browserkomponente und native WebView mit gebündeltem JS/CSS; OSM-Onlinetiles, Attribution, Retry                                           | Kein Google-Key; öffentliche OSM-Infrastruktur ohne SLA                          |
| GPS/Kompass  | Vordergrund-Standort, Ablehnung/Fehler/Genauigkeit/Alter, Fokusabbau; Peilung/Luftlinie, Geräteheading/Nordfallback                                       | Keine Feldtests. Acht Stationspunkte null, Weggeometrie leer, `fieldReady=false` |
| Dialog/Audio | `features/dialogue/`, `features/companion/`; sichtbarer Text, Deutsch-TTS, Stumm/Skip/Replay, Stoppen beim Verlassen                                      | Ganzbild-Posen und begrenzte Bewegung; kein Rig, Blinzeln oder Lip-Sync          |
| Design       | Adventure- und helle Discovery-Komponenten, Bree Serif/Nunito Sans, große Buttons, Original-Wyldo und ergänzte Naturillustrationen                        | Tokens bislang auf mehrere Dateien verteilt; Header-XP fehlt                     |
| Belohnung    | Vier Siegel und serverseitiger einmaliger Badgeabschluss im Bestand; abgeleitete Übungs-XP-Vorschau                                                       | Kein reguläres XP-Ledger/Levelsystem; keine echten Spielerbewertungen            |

## Screens und Aktionen

- Entdecken: Suche nach Titel/Region, vier Metadatenfilter, Merkliste und Offlinefilter, echte Questkarte, Download, Kapitel-/Siegelverknüpfung und Fortsetzung. Ohne geprüfte Zielorte wird die Region angezeigt, keine erfundene Nähe.
- Details: Bild, Originalfuchs, Geschichte, Dauer/Schwierigkeit/Strecke, lesende Sterneübersicht, Merken, Vorbereitung, Download, Kapitel/Siegel und Navigationsstart. Alters- und Startpunktinformation sollen sichtbarer werden.
- Navigation: Karten-/Richtungswechsel, virtuelle Distanz/Drehung, Pause, Tipp und Link zur bestehenden Spielansicht. Vorschau löst keine Rätsel und vergibt keine Belohnungen.
- Karte: echte Basiskarte, fünf belegte OSM-Orientierungsorte, Standortfreigabe, acht Kapitel und freigeschaltete Aufgaben. Keine freigegebenen Quest-Pins vorhanden.
- Rucksack: bestehende Quest-/Siegelübersicht und Spielstand; Profil: Konto, Erfolge, Audio, Bewegung, Download, Sync, Datenschutz, Reset/Logout. Diese Bereiche werden in Phase 2 erhalten.
- Spiel/Erfolg: acht verschiedene Aufgaben mit je zwei Hinweisen, vier Siegel, Fortschritt und Kristallfinale; ursprüngliche Schatzkarte/Runa-Handlung. Inhalte sind Entwicklungsentwurf, keine redaktionelle Freigabe behauptet.

## Schulden und Risiken

`QuestProvider` bündelt zu viele Anwendungsfälle; später in Dienste aufteilen. Veröffentlichung und Clientvalidierung benötigen vor Livebetrieb einen vollständigen Schema-/Contentvertrag. Kartenimplementierungen duplizieren Darstellungslogik; Routendarstellung muss zusätzlich an Freigabe gebunden werden. Ein einziger aktiver Run und eine Quest begrenzen derzeit den Katalog. Die Oberfläche darf solche Grenzen nicht durch zusätzliche erfundene Questkarten verdecken.

## Reproduzierbare Prüfung

`npm ci --include=dev`; `npm run check` (TypeScript, ESLint, Jest); `npm run test:database`; `npm run test:web`; `npm run export:web`; `npm run check:release`; `npm run export:native`. Browser: Chromium; Cloud `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`. Smartphone: `npm run start:phone`, Expo Go SDK 57; Google mobil benötigt Development Build. Keine neuen Dienste oder Abhängigkeiten für Phase 2 erforderlich. Ergebnisse dieser Iteration stehen im [Abnahmebericht](../reviews/phase-1-2-acceptance.md).
