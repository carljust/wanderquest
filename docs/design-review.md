# Wyldo – Designreview, Phasen 1–3

Stand: 16.10.2026 · Branch `feat/wyldo-adventure-design-review` · Basis `3234cff` (Designpaket auf `main`). [Draft-Pull-Request #1](https://github.com/carljust/wanderquest/pull/1) · **Designfreigabe ausstehend.** Dieser Bericht belegt den UI-Schritt, keine vollständige Produktabnahme.

## Verbindliche Grundlage und Umfang

Alle sechs Markdown-Unterlagen in [wyldo_codex_designpaket_v1](wyldo_codex_designpaket_v1/README.md), die drei großen Referenzbilder, die Storyboards, beide Fuchsreferenzen und der Quest-Entwurf wurden geprüft. Der jüngste [Nutzerauftrag](reviews/phase-1-3-request.md) bestimmt: **„Nach Phase 3 anhalten und auf meine Freigabe warten.“** Neue Quest-Engine, reguläres XP-/Level-Backend und weitere Masken bleiben deshalb zurückgestellt. [Analyse und Entwicklungsplan](development-plan.md).

Der Paket-Seed enthält fünf Alva-/Sternenkompass-Stationen und ungeprüfte Ortsangaben. Er wird nicht importiert. Die vorhandene Geschichte mit acht Stationen, Schatzkarte, Runa, vier Siegeln und Kristall bleibt erhalten. Auch Authentifizierung, Supabase-Migrationen, Rätsellogik, Offline-Outbox und serverseitige Abzeichenregeln werden in diesem Schritt nicht ersetzt.

## Implementiert

| Bereich                | Ergebnis                                                                                                                                                                                                                                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Designsystem           | Zentrale Farben aus DESIGNSYSTEM.md, Waldillustration, Goldrahmen, Holzbedienung, Pergamentflächen, Bree Serif/Nunito Sans und große bedienbare Aktionen. Wiederverwendbare Screen-, Panel-, Button-, Status-, HUD- und Kompasskomponenten.                                                                                     |
| Entdecken              | Holz-Wyldo-Logo, Originalfuchs, Begrüßung, tatsächliche Questkarte, Suche, funktionale Filter für gemerkte/heruntergeladene Quests, Leeransicht mit Rücksetzen, Fortsetzung und Einstellungen. Keine erfundenen zusätzlichen Quests.                                                                                            |
| Questdetails           | Bildkomposition mit Original-Wyldo, Geschichte aus Questdaten, Kapitel/Siegel/Übungs-XP-Vorschau, ehrlicher Routenstatus, Vorbereitung, persistente Merkliste, Download und bestehende Fortschritts-/Kartenansicht. „Zum Startpunkt navigieren“ bleibt unten erreichbar und beginnt noch keinen Storydialog.                    |
| Navigation             | Funktionale Umschaltung Karte/Richtung, echte OSM-Kacheln samt Attribution, berechnete Peilung/Luftliniendistanz, Kompass-Gültigkeit, Vordergrund-GPS und Fehlerzustände. Gerätekompass nur mit gültiger Kalibrierung; Browser fällt auf Norden oben zurück. Kartenwechsel und Pause bleiben erreichbar.                        |
| Entwicklungsvorschau   | Deutlich beschrifteter virtueller Abstand, Drehung und Zielsimulation. Keine simulierten Punkte auf der echten Karte; Navigation verändert keine Stationsergebnisse. Über „Zur Spielansicht“ ist der vorhandene Übungsablauf erreichbar.                                                                                        |
| Fortschritt/Navigation | Lokaler kontogetrennter Merkstatus mit Migration alter Snapshots. „Quest pausieren“ stoppt Standortbeobachtung und kehrt nach Entdecken zurück; vorhandener Spielstand bleibt erhalten. Vier Tabs in der Reihenfolge Entdecken/Karte/Rucksack/Profil. Der Rucksack verwendet vorerst die vorhandene Abenteuer-/Siegelübersicht. |
| Wyldo                  | Unveränderte Original-PNG mit vier Ganzbildposen, per Viewport ausgewählt. Keine zerschnittenen Gesichter oder erfundene Rig-Funktionen. Während Navigation nur auf ausdrücklichen Tipp-Aufruf sichtbar.                                                                                                                        |

Die Übungs-XP sind ausschließlich eine UI-Vorschau aus dem vorhandenen lokalen Fortschritt (100 je Station, 500 beim Übungsfinale, 600 je Vorschaulevel). Sie schreiben keine regulären XP, kein Abzeichen und keine neue Datenbanktabelle. Der spätere XP-Vertrag muss nach Designfreigabe abgestimmt werden. Pause besitzt hier ebenfalls noch keinen neuen serverseitigen Pausenzustand.

## Ergänzung nach Nutzerfeedback: Questangaben und Sterne

Dauer, Strecke und Rätsel-Schwierigkeit sind unmittelbar unter dem Questbild sichtbar. Eine wiederverwendbare Sterneübersicht zeigt den gelieferten Durchschnitt und die Anzahl der Bewertungen; die ausdrücklich gewählte Variante ist rein lesend. Der Entwurf enthält `average: null, count: 0`, entsprechend **keine erfundene Wertung**. Fehlende/ungültige Aggregate werden als nicht verfügbar ausgewiesen. Es gibt noch keine Erfassung oder Live-Aggregation von Rezensionen; der Datenvertrag ist in [Backend](backend.md#questangaben-und-sterneübersicht) beschrieben.

Dauer bleibt „Noch zu vermessen“, Strecke „Route noch in Prüfung“, Schwierigkeit „Rätsel: leicht bis mittel“. Die Freigabe der tatsächlichen Route und ihrer Zeitangaben bleibt offen. Die beiden Detail-Screenshots wurden nach der Ergänzung auf 360×800 und 320×640 aktualisiert; Story und Navigation bleiben nutzbar.

## Visueller Abgleich

[Referenz und tatsächliche Aufnahme nebeneinander](design-review.html). Die Screenshots stammen aus laufendem Expo Web in Chromium mit mobiler Emulation; keine montierten Mockups. Texte und Bedienelemente sind echte React-Native-Komponenten.

| Ansicht      | Referenz                                                                                | Tatsächliche Aufnahme                                                        | Kleine Ansicht                                              |
| ------------ | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Entdecken    | [01_entdecken](wyldo_codex_designpaket_v1/mockups/01_entdecken.png)                     | [360×800](screenshots/design-v1/01-discover.png)                             | [320×640](screenshots/design-v1/01-discover-small.png)      |
| Questdetails | [02_quest_details](wyldo_codex_designpaket_v1/mockups/02_quest_details.png)             | [360×800](screenshots/design-v1/02-quest-details.png)                        | [320×640](screenshots/design-v1/02-quest-details-small.png) |
| Richtung     | [03_navigation_richtung](wyldo_codex_designpaket_v1/mockups/03_navigation_richtung.png) | [390×844](screenshots/design-v1/03-navigation-direction.png)                 | [320×640](screenshots/design-v1/03-navigation-small.png)    |
| Karte        | Navigationsaufbau derselben Referenz                                                    | [390×844, geladene OSM-Kacheln](screenshots/design-v1/03-navigation-map.png) | Umschaltung im 320-Pixel-Test geprüft                       |

Übereinstimmung: Wald-/Goldkomposition, Holzlogo, Originalfuchs, Bildkarten, warme Typografie, grüne Hauptaktionen, Pergament, vier Haupttabs sowie HUD und goldener Kompass. Korrigiert wurden abgeschnittenes Logo, zu hohe Kopfbereiche, versteckte Hauptaktionen, der intrinsische Bildüberlauf im Web und fehlende zugängliche Moduskennzeichnung. Kleine Ansichten verwenden vertikales Scrollen; unter 700 Pixel Höhe steht die Entfernung über dem Kompass.

Bewusste Abweichungen: nur die tatsächlich vorhandene Quest; kein erfundener Live-Level, keine ungeprüften Kilometer/Minuten oder Abbiegeanweisungen. Statt fertigem Wanderweg zeigt die Karte bislang belegte Orientierungspunkte. Wyldo bleibt auf Navigation gemäß SCREENS.md nicht dauerhaft eingeblendet. Formen, Illustrationen und Holzoberflächen sind eine Umsetzung der Referenz, kein pixelidentischer Export. Der Expo-Entwicklungsindikator kann auf Browseraufnahmen sichtbar sein und gehört nicht zum Produktdesign.

## Prüfungen

| Prüfung                    | Tatsächliches Ergebnis                                                                                                                                                                                                                                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Saubere Installation       | `npm ci --include=dev --no-fund`: 1196 Pakete, erfolgreich mit Node 24.19.0/npm 11.9.0. Transitive Deprecation-Hinweise blockieren den Start nicht.                                                                                                                                                                   |
| TypeScript / ESLint        | `npm run typecheck` und `npm run lint`: bestanden, keine Warnungen.                                                                                                                                                                                                                                                   |
| Unit-/Komponentenprüfungen | 45 Tests in zehn Suiten bestanden: bestehende Quest-/Auth-/Dialogregeln plus Peilung, Rotation, ungenaues/veraltetes GPS, verifizierte Ziele, virtuelle Distanz, Sensorabbau bei Fokusverlust, gespeicherte Merkliste und XP-Vorschau; zusätzlich Sterneformatierung, leere sowie fehlende/ungültige Bewertungsdaten. |
| Datenbankregression        | 40 PostgreSQL-Assertions mit PGlite bestanden: Seed, RLS, private Lösungen, GPS-/Reihenfolgeregeln, idempotente Abschlüsse und Ausschluss regulärer Übungsabzeichen. Keine echte Supabase-API angesprochen.                                                                                                           |
| Browser                    | Alle acht Playwright-Fälle bestanden: SDK-57-Manifest, kompletter Acht-Stationen-Übungslauf, Hinweise/Untertitel/Stumm/Skip/Finale, Persistenz, Offline/Reconnect, Formulare/geschützte Route, Suche/Filter/Merkliste, Kartenwechsel/virtuelle Navigation/Pause, Kartenfehler/Retry und native HTML-Bridge.           |
| Sichtprüfung               | Alle drei Masken und Kartenmodus manuell anhand der erzeugten Browseraufnahmen mit den Originalreferenzen verglichen; zusätzlich 320×640. Kein horizontaler Dokumentüberlauf; Hauptaktionen und Entfernung geprüft. Keine Pixel-Diff- oder native Gerätetest-Behauptung.                                              |
| Exports                    | Web sowie iOS-/Android-Hermes-Export erfolgreich. Produktions-Webbundle enthält keine Entwicklungsquest/Antwortfixtures (`npm run check:release`). Das sind keine signierten Apps und keine Gerätetests.                                                                                                              |
| Formatierung               | Prettier und `git diff --check`: bestanden.                                                                                                                                                                                                                                                                           |

Browserprüfungen verwenden ausschließlich Übungsfortschritt und synthetische Testdaten; keine echten Benutzerkonten oder Remote-Migrationen. Die letzten schmalen Buttonlabels wurden nach der Sichtprüfung korrigiert und mit den betroffenen zwei Browserfällen erneut geprüft.

## Noch offen / zurückgestellt

- **Nach Freigabe:** automatischer Ankunft-/Begrüßungs-/Introfluss, erweiterte Quest-Zustandsmaschine, reguläre XP/Level mit serverseitigem Vergabevertrag und vollständige neue Rucksack-/Profil-/Kartenübersicht. Der vorhandene Acht-Stationen-Übungsablauf bleibt spielbar.
- **Zugangsdaten:** öffentlicher Supabase-Key und Google-Providerkonfiguration fehlen weiterhin. Kein Live-Login, kein Remote-Seed und keine Supabase-Feldsynchronisation dieses UI-Schritts behauptet. [Backend](backend.md), [Google](google-login.md).
- **Route:** acht geprüfte Stationspunkte, freigegebene zusammenhängende Weggeometrie und Begehung fehlen. `fieldReady=false`, alle Stationspunkte `null`. Die Navigationsvorschau gibt keine echten Wanderanweisungen vor. [Quellenstand](route-review.md).
- **Geräte:** echte iOS-/Android-Prüfung von Sensoren, GPS, Hintergrund/Rückkehr, nativer Karte, Tastatur, Safe Areas, Stimme und Google-Deep-Links steht aus. Webemulation und Bundle-Exports ersetzen das nicht.
- **Assets:** Original-Posen sind kein Rive-/Ebenen-Rig. Blinzeln, unabhängige Mund-/Armanimation und Visem-Sync bleiben ohne passendes Asset offen. Ergänzte Naturgrafiken sind generierte Illustrationen; Herkunft und Schriftlizenzen sind dokumentiert. [Manifest](../assets/design/manifest.json).
- **Offline:** vorhandene Quest-/Mediencache- und Outboxfunktionen bleiben bestehen. Keine Offline-Kacheln. Neue virtuelle Navigation ist keine Prüfung echter Supabase-Synchronisation.

## Diesen Stand starten

Den Branch `feat/wyldo-adventure-design-review` auschecken, Node 24.3–24.x verwenden, `npm ci --include=dev`, danach `npm run start:phone` (Expo Go mit SDK 57) oder `npm run web`. Alten Expo-Prozess beenden und den neu erzeugten QR-Code verwenden. Einstieg: „Ohne Konto im Entwicklungsmodus testen“ → „Abenteuer entdecken“ → „Zum Startpunkt navigieren“. [Ausführliche Anleitung](../README.md).

Keine Zusammenführung nach `main` und kein weiterer Ausbau vor Designfreigabe.
