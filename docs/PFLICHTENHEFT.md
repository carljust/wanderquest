# Wyldo – Technisches Pflichtenheft MVP
Version 1.0 (Entwurf) | 16.10.2026 | Repository: `carljust/wanderquest`

## 1. Zweck und Zielbild
Wyldo ist ein GPS-basiertes Outdoor-Abenteuerspiel für Familien mit Kindern (primär ab ca. 7 Jahren). Die Natur ist die Spielwelt. Spieler entdecken Quests, navigieren zum Startpunkt und zwischen Stationen, erleben die Geschichte mit dem Fuchs Wyldo, lösen Rätsel und verdienen XP, Level, Abzeichen und Fundstücke.

**MVP-Erfolg:** Die Mission **„Der verlorene Schatz der Externsteine“** ist von Anmeldung bis Abschluss spielbar, einschließlich GPS-Navigation, Pause/Fortsetzen und Rucksack. Die ursprüngliche Geschichte um die alte Schatzkarte, vier Steinsiegel und Runa den Steinkauz hat Vorrang vor späteren Alternativgeschichten. Verbindlicher vollständiger Dialog- und Rätseltext muss fachlich freigegeben werden; fehlende Inhalte dürfen nicht erfunden und als freigegeben ausgegeben werden.

**Verbindliche Designreferenz:** Freigegebene Screens Entdecken, Quest-Details und Richtungskarte sowie das 12-Screen-Quest-Storyboard im Paket `docs/design/wyldo-v1/`. Nicht eine Bilddatei als Bildschirmhintergrund verwenden: Interaktive Elemente nativ aufbauen. Mockups enthalten illustrative, nicht zwingend echte Kartendaten und Beispielzahlen; Realwelt-/Routenangaben müssen validiert werden.

**Bestehendes Projekt erhalten:** Expo/React Native/TypeScript/Expo Router; bestehende Tests, Navigation und nutzbare Komponenten weiterverwenden. Noch keine komplette Neuanlage des Projekts.

## 2. UX-Prinzipien und globale Navigation
- Nach Anmeldung öffnet **Entdecken**: Quests in der Nähe, Suchfeld, gefilterte Ergebnisse; Standortfreigabe erst bei Bedarf, mit verständlichem Ersatz bei Ablehnung.
- Vier Tabs: **Entdecken · Karte · Rucksack · Profil**. Karte zeigt Quest-Pins; Antippen öffnet kompakte Vorschau und Link zur Detailansicht.
- Quest-Detail: Bild, Geschichte/Teaser, Altersgruppe, Schwierigkeit, Länge, Dauer, reale Startposition, Hinweise, XP/Belohnung. Primäre Aktion: „Zum Startpunkt navigieren“.
- Navigation **vor und während Quest** in zwei umschaltbaren Modi: **Karte** (echte Basiskarte, GPS, freigegebener Wander-Track und Ziel) sowie **Richtung** (großer Zielpeilpfeil, Luftlinienentfernung, GPS-Genauigkeit, deutlicher Hinweis „auf Wegen bleiben“). Pfeil nicht als begehbare Weganweisung bezeichnen.
- Am Startpunkt: GPS-Prüfung → sichtbare Ankunft → Nutzer bestätigt „Quest starten“ → kurzes Intro → Wyldo leitet ein → nächste Navigation.
- An jeder Quest-Station: GPS-Prüfung → Wyldo-Dialog/Aufgabe → Erfolg/ggf. Steinsiegel → Navigation zur nächsten Station.
- Finale: kurze Abschlussanimation, Zusammenfassung, XP, Abzeichen. Quest jederzeit pausierbar, später an identischer Station und mit gleichen bereits gelösten Aufgaben fortsetzbar.
- **Rucksack:** laufende und abgeschlossene Quests, XP, Level, Abzeichen, Sammlerstücke. **Profil:** Konto, Datenschutzeinstellungen, Audio, Hilfen.
- Wyldo ist der Fuchs mit grünem Schal, Rucksack und Kompass; nur bei Intro, Dialogen, Ereignissen, Rätseln/Belohnungen. Animation/Voice dürfen bei fehlendem Asset durch sauber gekennzeichnete statische Pose bzw. Text ersetzt werden; kein Fake-Lip-Sync als fertige Funktion.

## 3. Nichtfunktionale Anforderungen
- iOS und Android, Touch-Ziele mindestens ca. 44–48 dp, lesbar im Tageslicht, Kontrast und reduzierte Bewegung berücksichtigen.
- GPS nur nach Einwilligung; keine permanente Hintergrundverfolgung im MVP. Ungenaue Position darf nicht automatisch freischalten. Konfigurierbarer Radius plus Genauigkeitsgrenze, Hysterese/Debounce und manuell freizugebender Testmodus.
- Offline-Fortschritt auf dem Gerät, spätere Synchronisation mit zentraler Datenbank; Konflikte deterministisch lösen, abgeschlossene Aufgaben nicht doppelt belohnen.
- Supabase Auth, PostgreSQL mit RLS, Storage; niemals `service_role`-Schlüssel im Client. Rätsellösungen serverseitig prüfen, Offline-Modus erhält definierte abgesicherte Alternative.
- Keine öffentliche, ungeprüfte Route oder Lagepunkte; GPX/Wegeführung und GPS-Trigger vor Veröffentlichung vor Ort prüfen. Geschützte Bereiche und Kletterstellen nicht als Pflichtziel.
- Automatisierte Tests (Unit, Integration, E2E in geeigneter Umgebung), echte Gerätetests, reproduzierbarer Build und Dokumentation.

## 4. Domänenmodell (mindestens)
- `profiles` (user_id, display_name, avatar, level_summary)
- `missions` (id, title, region, description, age_min, duration, difficulty, status, start_lat, start_lon, cover_asset_id)
- `routes` (id, mission_id, approved_gpx_asset_id, verification_status, verified_at)
- `stations` (id, mission_id, sequence, title, lat, lon, arrival_radius_m, accuracy_limit_m, kind)
- `story_nodes` (id, mission_id, station_id?, type, text, speaker, emotion, media_asset_id?, order)
- `challenges` (id, station_id, type, prompt, rules, reward_xp, validation_policy)
- `challenge_secrets` (challenge_id, solution encrypted/restricted), niemals für Clients lesbar
- `user_mission_runs` (id, user_id, mission_id, status, current_station_id, version, started_at, paused_at, completed_at)
- `challenge_attempts` (run_id, challenge_id, result, attempted_at, idempotency_key)
- `inventory_items`, `user_inventory`, `badges`, `user_badges`, `xp_ledger`
- `media_assets` (id, storage_path, media_type, size, license, attribution)

Schema als versionierte Supabase-Migrationen. Referentielle Integrität, passende Indizes, eindeutige Idempotenzschlüssel und RLS-Policies testen. Exakte Feldnamen können nach Architekturprüfung angepasst werden, solange die Fachlichkeit erhalten bleibt.

## 5. Entwicklungsphasen mit Codex-Aufträgen und Abnahme

### P1 – Bestandsaufnahme und Architektur
**Auftrag:** Analysiere Repository und Referenzpaket. Erstelle `docs/architecture/AS_IS.md`, `TARGET.md`, `GAP_ANALYSIS.md`, `IMPLEMENTATION_BACKLOG.md`. Plane Komponenten, State Machine, Navigation, Daten- und Offline-Fluss. Keine UI-Neuschreibung in diesem Schritt.

**Abnahme:** Jede bestehende Funktion ist erfasst; vorhandene Tests und Startbefehle dokumentiert; Lücken nach Muss/Soll priorisiert; technische Risiken und offene Entscheidungen ausgewiesen; keine Regressionen.

### P2 – Designsystem und freigegebene Kernmasken
**Auftrag:** Implementiere wiederverwendbare UI-Token, Button-/Card-/Dialog-/Progress-/QuestPin-Komponenten. Baue **Entdecken**, **Quest-Detail** und **Navigation in zwei Modi** visuell nach den Referenzen. Verwende echte bereitgestellte Assets, trenne dekorative Illustration von echter Karte. Vier Tabs anlegen; unfertige Bereiche explizit markieren.

**Abnahme:** Die drei Screens werden auf mindestens einer schmalen Android- und einer iPhone-Viewport-Größe verglichen; Screenshot-Differenzen werden dokumentiert; alle sichtbaren Schaltflächen haben definiertes Verhalten; Suche filtert Missionsliste; Detail öffnet richtige Quest; Modus-Umschaltung funktioniert; TypeScript/Lint/UI-Tests laufen. **Nach P2 stoppen und Design-Freigabe einholen.**

### P3 – Supabase, Auth und Cloud-Daten
**Auftrag:** Auth-Flow (Google-Login sowie definierte alternative Anmeldung), persistente Session, sicheres Profil, DB-Migrationen/RLS, Mission-/Station-/Dialog-APIs, Storage-Medien, Seed für Entwicklungsdaten. `.env.example` ohne Secrets und Installationsanleitung anlegen.

**Abnahme:** Testnutzer kann anmelden/abmelden/wiederanmelden; Mission wird aus Supabase geladen; keine produktiven Secrets im Repository; Policy-Tests zeigen, dass Nutzer keine fremden privaten Spielstände lesen/schreiben und keine geheimen Lösungen abrufen können.

### P4 – GPS, Karten und Richtungsmodus
**Auftrag:** Kartenanbieter samt Lizenz prüfen, reale Karte und Geräteposition integrieren, geprüften Weg-Track anzeigen, Zielmarkierungen und Entfernung, Peilung mit Gerätesensoren/Fallback, Umschalten zwischen Karte und Richtung. Simulationsmodus für Entwickler und Berechtigungs-/Genauigkeitsfehler implementieren.

**Abnahme:** Umschaltung erhält Missionsstatus; Richtungspfeil zeigt korrekte Peilung zum Ziel (nicht Wegverlauf); Stationsankunft wird nur bei plausibler GPS-Genauigkeit plus Radius stabil ausgelöst; Standortablehnung und fehlender Sensor sauber gehandhabt; Wegdaten als `not_verified` erkennbar bis zur Geländeprüfung.

### P5 – Generische Quest-Engine
**Auftrag:** Zustandsmaschine implementieren: `not_started → navigate_to_start → ready_to_start → intro → navigating → arrived → dialogue/challenge → rewarded → navigating … → completed`, plus `paused`, `resume`, Fehlerzustände. Verschiedene Aufgabentypen (MC, Text, Beobachtung, Audio) und Hinweise, Dialog-Renderer mit Wyldo, Pause/Fortsetzen, Offline-Speicherung/Synchronisierung.

**Abnahme:** Mehrstationige Testquest Ende-zu-Ende spielbar im Simulationsmodus; App-Neustart erhält Run; Doppel-Taps/Doppel-Requests geben keine doppelten XP; kein Überspringen gesperrter Stationen ohne freigegebene Testfunktion; Tests für Zustandsübergänge, Fehlversuche, offline/online.

### P6 – „Der verlorene Schatz der Externsteine“
**Auftrag:** Ursprüngliche Story als versionierte Quest-Daten einpflegen: 8 Kapitel, 4 Steinsiegel, Fuchs Wyldo und Runa, Story-Dialoge, passende unterschiedliche Rätsel, Hinweise, Abschluss. Illustrationen/Audios als einzelne assets referenzieren. GPX-Track und GPS-Punkte bis zur fachlichen/feldseitigen Prüfung als vorläufig kennzeichnen.

**Abnahme:** Jedes Kapitel hat Ziel, Dialog, Aufgabe, Lösungskontrolle und Übergang; Gesamtstory ist konsistent; vier Steinsiegel werden gesammelt; Finale wird ausgelöst; Medien geladen/offline angezeigt; GPS-Route dokumentiert und später draußen geprüft. Keine unzutreffende Kennzeichnung als „verifizierte Wanderroute“.

### P7 – Rucksack, XP und Level
**Auftrag:** Vier-Tabsystem abschließen. Rucksack listet Pausenstände, absolvierte Quests, Fundstücke, XP/Level, Abzeichen; XP-Ledger transaktionssicher aufbauen, Level-Regeln konfigurierbar halten; Quest-Abschlussanimation und Zusammenfassung integrieren.

**Abnahme:** XP einmalig vergeben; nach Neuinstallation/Anmeldung (mit Netz) wird zentraler Fortschritt wieder geladen; Inventar und Abzeichen entsprechen Quest-Ergebnissen; pausierte Quest ist aus Rucksack fortsetzbar.

### P8 – Qualität und geschlossener Feldtest
**Auftrag:** Geräte-E2E, GPS-Szenarien, Offline-, Performance-, Accessibility- und Datenschutztests. Externsteine-Strecke vor Ort mit begleitenden Erwachsenen begehen und Trigger-Koordinaten prüfen. Absturz- und Supportdiagnostik datensparsam vorsehen, Release-Checkliste und Fehlerliste erstellen.

**Abnahme:** Ein vollständiger Betatest der Mission mit echten Geräten gelingt ohne blockierende Fehler; korrekte Wegführung auf öffentlichen Wegen; Berechtigung, Offline-Wiederaufnahme und Abschluss zuverlässig; kritische Bugs behoben und offene Punkte transparent dokumentiert.

## 6. Arbeitsregeln für Codex
1. Arbeite auf einem Feature-Branch; keine ungenehmigten Änderungen am `main`.
2. Vor jeder Phase: vorhandene Codestruktur prüfen, dann kleine Schritte implementieren.
3. Keine Screens als bloße Vollbild-Mockup-Bilder; Komponenten nativ entwickeln.
4. Keine erfundenen API-Keys, Koordinaten, geprüften Routen oder Erfolge behaupten.
5. Nach jeder Phase: Änderungsübersicht, Screenshots, Tests, offene Risiken und Pull Request liefern.
6. Fehlende Asset-Dateien, Zugangsdaten oder nicht freigegebene Original-Story ausdrücklich melden.
7. Jede Phase benötigt Nutzerfreigabe; insbesondere nach P2 keine Backend-/Quest-Massenimplementierung ohne Freigabe.

## 7. Offene Produktentscheidungen
- Vollständiger Originaltext und genaue Aufgaben der Externsteine-Geschichte müssen als verbindliche Quest-Daten vorliegen.
- Supabase-Projekt/Region, Auth-Provider-Konfiguration und geeigneter Karten-/Offlinekartenanbieter.
- GPS-Trigger, offizieller GPX-Weg, Zugangsregelungen und praktische Feldprüfung.
- Medienlizenzen und Master-Assets des Fuchses; animiertes Rig ist optional für MVP.
- Festlegung genauer XP-Werte und Levelschwellen sowie Kinderschutz-/Elternkonto-Konzept vor öffentlichem Launch.
