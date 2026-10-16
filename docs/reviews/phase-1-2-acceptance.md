# Phase 1 und 2 · Ergebnis zur Designfreigabe

16.10.2026 · Branch `feat/wyldo-adventure-design-review` · [Pull Request #1](https://github.com/carljust/wanderquest/pull/1). Grundlage: [aktueller Auftrag](phase-1-2-request.md). Die Nutzerfreigabe steht aus; spätere Phasen werden nicht begonnen.

## Phase 1

Repository, Architektur und Originalreferenzen geprüft. Die angefragten Dokumentpfade fehlen; verwendet wurden die tatsächlich vorhandenen, bereits vom Nutzer benannten Pfade `docs/PFLICHTENHEFT.md` und `docs/wyldo_codex_designpaket_v1/`. Keine fehlenden Spezifikationen als freigegeben ausgegeben.

- [Ist-Architektur und Funktionen](../architecture/AS_IS.md)
- [Zielarchitektur, Zustände und Datenfluss](../architecture/TARGET.md)
- [Lücken, Risiken und Prioritäten](../architecture/GAP_ANALYSIS.md)
- [Konkreter Umsetzungsplan](../architecture/IMPLEMENTATION_BACKLOG.md)

Ausgangsprüfung: TypeScript und Lint bestanden, 49 Jest-Tests in elf Suiten bestanden. Auth-, Quest-, Offline- und Serververträge wurden erhalten; keine neue Migration und keine Backendadministration.

## Phase 2: tatsächlich ergänzt

| Bereich      | Umsetzung                                                                                                                                                                                                                                                                                                   |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Designsystem | `src/theme/tokens.ts` zentralisiert Farben, Schriften, Abstände, Rundungen und Touchmaß. Helle Discovery- und immersive Adventure-Varianten teilen diesen Vertrag. Wiederverwendbare `PlayerProgress`, `WyldoMessage`, `NavigationModeSwitch` und SVG-Quest-Pins ergänzen vorhandene Karten/Buttons/Panels. |
| Entdecken    | Jüngste helle Referenz beibehalten; Original-Wyldo, überlappende Suche nach Titel/Region, Filter, Merken, Download und Fortsetzung. Neu: Header mit Übungslevel und XP-Balken als beschriftete Vorschau. Ohne Kontodaten wird kein Level erfunden.                                                          |
| Details      | Titelbild, Schatzgeschichte, Dauer, Schwierigkeit, Strecke und lesende Sterne bleiben. Altersstatus, vorgeschlagener Startbereich, Zielgruppe und Abschlussabzeichen ergänzt. Kapitel-/Siegelzahlen aus Questdaten. Navigationsstart bleibt erreichbar und öffnet keinen automatischen Storydialog.         |
| Navigation   | Wiederverwendbarer Karten-/Richtungsschalter mit Icons und Goldverlauf. Berechneter Peilpfeil, virtuelle Bewegung/Drehung und Pause bleiben. Zielentfernung jetzt auch im Kartenmodus direkt oberhalb der Karte. Kurze Buttontexte verhindern Wortabbrüche.                                                 |
| Echte Karte  | Gemeinsame Projektion `map-model.ts` für Browser/WebView: freigegebene Stationsmarker, hervorgehobener Zielpin, GPS-Punkt/Genauigkeitskreis und geprüfter Track vorbereitet. Unfreigegebene oder ungültige Geometrie verworfen, niemals durch Luftlinien ersetzt. OSM-Onlinetiles und Attribution bleiben.  |
| Bestand      | Vier Haupttabs und Acht-Stationen-Übungsablauf mit Dialogen, Rätseln, Siegeln, Persistenz und Offlinecache erhalten. Kein Creator-Modus. Keine neue reguläre XP-Vergabe.                                                                                                                                    |

## Automatisierte Prüfungen

| Abschnitt / Befehl             | Tatsächlich ausgeführt                                                                                                                                                                                                                                           |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nach Bestandsaufnahme          | `npm run check`: 49/49 Tests, TypeScript und ESLint bestanden                                                                                                                                                                                                    |
| Nach Design-/Kartenergänzungen | `npm run check`: 55/55 Tests in 13 Suiten, TypeScript und ESLint ohne Warnungen                                                                                                                                                                                  |
| Karten-Datenvertrag            | Vier neue Tests: Entwurf/Teilfreigabe bleibt unsichtbar; geprüftes Ziel/Track projiziert; ungültiges/veraltetes GPS verworfen; SVG ohne Content-HTML                                                                                                             |
| Header-XP                      | Zwei neue Tests: fehlende Kontodaten erzeugen keinen Level; Übung ist Vorschau mit zugänglichem Fortschritt                                                                                                                                                      |
| Datenbankregression            | `npm run test:database`: 40/40 PostgreSQL-Assertions mit PGlite; keine echte Supabase-Verbindung                                                                                                                                                                 |
| Vollständiger Browserdurchlauf | `npm run test:web`: 10/10 Playwright-Fälle bestanden, einschließlich acht Stationen, Offline/Neustart, Authformulare, Suche/Filter/Merken, Kartenwechsel/Pause, Kachelfehler/Retry, HTML-Bridge und Ziel-/Track-/Positionsrenderer mit synthetischen Koordinaten |
| Nach letzter Sichtkorrektur    | Betroffener Navigationsfall erneut geprüft: Kartenentfernung im Viewport, Moduswechsel erhält virtuelle Distanz, keine stille Stationsfreischaltung                                                                                                              |
| Produktionsprüfung             | Webexport, Release-Fixture-Ausschluss und iOS-/Android-Hermesexport bestanden; keine signierten Builds oder nativen Gerätetests                                                                                                                                  |
| Formatierung                   | Prettier und `git diff --check` bestanden; Nutzeroriginale ausgenommen                                                                                                                                                                                           |

Zwischenstände: Die neue Fortschrittsrolle benötigte `accessible`; das wurde korrigiert. Der neue Browsertest unterschied zunächst den Standortpunkt nicht vom Genauigkeitskreis; die Auswahl ist präzisiert. Keine Tests deaktiviert oder übersprungen. Expo-SDK-57-, LinearGradient- und Router-Dokumentation waren in dieser Iteration abrufbar.

## Screenshots und visueller Vergleich

Echte Aufnahmen aus laufendem Expo Web in Chromium, keine montierten Mockups. 360×800 (schmales Android-Format), 390×844 (iPhone-Format) und 320×640. Browseremulation, keine Geräteabnahme. [Galerie mit Referenzen](../design-review.html).

| Ansicht      | Aufnahme                                                                         | Weitere Größen/Zustände                                                                                                                                                                                                                         |
| ------------ | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Entdecken    | [360×800](../screenshots/phase-1-2/01-discover.png)                              | [390×844](../screenshots/phase-1-2/01-discover-iphone.png), [320×640](../screenshots/phase-1-2/01-discover-small.png), [Aktionen](../screenshots/phase-1-2/01-discover-actions.png), [Filter](../screenshots/phase-1-2/01-discover-filters.png) |
| Questdetails | [360×800](../screenshots/phase-1-2/02-quest-details.png)                         | [390×844](../screenshots/phase-1-2/02-quest-details-iphone.png), [320×640](../screenshots/phase-1-2/02-quest-details-small.png), [Startpunkt/Belohnung](../screenshots/phase-1-2/02-quest-rewards.png)                                          |
| Richtung     | [390×844](../screenshots/phase-1-2/03-navigation-direction.png)                  | [320×640](../screenshots/phase-1-2/03-navigation-small.png)                                                                                                                                                                                     |
| Karte        | [390×844 mit realen OSM-Kacheln](../screenshots/phase-1-2/03-navigation-map.png) | virtuelle Distanz, keine simulierten Ziele auf realer Karte                                                                                                                                                                                     |

| Abgleich                                    | Ergebnis / Abweichung                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Entdecken gegen jüngstes Chatbild           | Naturkopf, Creme, runde Suche, grüne Aktionen, Bildkarten und helle Tabs übernommen. Wyldo statt OpenQuest/Grünmaskottchen. Nur eine tatsächliche Quest; kleine Karten sind echte Kapitel-/Downloadaktionen. Keine behauptete Nähe ohne freigegebene Questorte.                                                                                       |
| Details gegen `02_quest_details.png`        | Naturbild, Originalfuchs, Serifentitel, grüne Hauptaktion, Goldrahmen und Pergament übernommen. Zusätzliche Freigabe-/Bewertungshinweise machen die Seite länger; Inhalt scrollbar, Aktion unten fest. Keine pixelidentische Kopie behauptet.                                                                                                         |
| Richtung gegen `03_navigation_richtung.png` | Quest-HUD, Umschaltung, goldener Kompass, große Distanz und Pause übernommen. Wyldo nur auf Tipp-Aufruf gemäß Screenvertrag. Keine erfundenen Abbiegeanweisungen, Wegzeiten oder Routenzahlen.                                                                                                                                                        |
| Korrigierte Layoutfehler                    | XP-Karte überlagerte bei 320 Pixeln die Begrüßungsfläche: Headerhöhe angepasst und Panelgrenzen geprüft. Modusbutton brach mitten im Wort um: kurze Labels mit vollständiger zugänglicher Beschriftung. Kartenentfernung war unterhalb des Ausschnitts: oberhalb der Karte platziert, Viewport-Assertion ergänzt. Kein horizontaler Dokumentüberlauf. |

## Offen oder noch nicht verifiziert

- **Outdoor:** acht freigegebene Ziele, zusammenhängender geprüfter Track und Begehung fehlen. Kartenaufnahmen zeigen fünf belegte Orientierungspunkte, keine fertige Missionsroute. Zielpin/Track/GPS mit synthetischen Daten geprüft, nicht als Externsteine-Feldroute ausgegeben.
- **Metadaten:** tatsächliche Länge, Dauer und genaue Quest-Altersempfehlung fehlen. Die globale Zielgruppe ab etwa sieben Jahren ist davon getrennt. Null Bewertungen ergeben keine erfundene Sternezahl. Reguläre XP nicht verfügbar; Übungswerte bleiben Vorschau.
- **Live-Dienste:** öffentlicher Supabase-Key und Provideradministration fehlen. Kein Live-Login, Remote-Seed oder Google-Gerätenachweis in diesem Auftrag. Bestehende Implementierung erhalten.
- **Geräte:** Sensoren, GPS, WebView, Tastatur, Safe Areas, OAuth und Stimme auf echten iOS-/Android-Geräten noch zu prüfen. Hermesexports ersetzen das nicht.
- **Assets:** ganze Original-PNG-Posen; kein Character-Rig, unabhängiger Mund/Arm oder Visem-Sync. Naturgrafiken sind Illustrationen mit Herkunftsnachweis.
- **Später:** vollständiger Ankunft-/Intro-/Pauseautomat, reguläres XP-Ledger und neue Rucksack-/Profil-/Katalogmasken benötigen weitere Freigabe. Vorhandene Übung bleibt verfügbar.

## Starten und Freigabe

Feature-Branch verwenden, lokale Änderungen vorher sichern, `npm ci --include=dev`, dann `npm run start:phone`. Alten Expo-Prozess schließen, neuen QR-Code scannen; Expo Go muss SDK 57 unterstützen. Einstieg: „Ohne Konto im Entwicklungsmodus testen“ → „Abenteuer entdecken“ → „Zum Startpunkt navigieren“. [Startanleitung](../../README.md).

Der Auftrag verlangt: **„Nach Abschluss von Phase 2 stoppen und auf meine Freigabe warten.“** Deshalb endet die Umsetzung an diesem überprüfbaren Designstand. Keine Zusammenführung nach `main`, kein Beginn weiterer Entwicklungsphasen.
