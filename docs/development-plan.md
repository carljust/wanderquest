# Wyldo – Plan für die Designfreigabe (Phase 1 und 2)

Der aktuelle [Auftrag für Phase 1 und 2](reviews/phase-1-2-request.md) ist maßgeblich: Bestandsaufnahme und drei Hauptmasken, danach **Stopp für die Designfreigabe**. Weitere Quest-Engine-, Supabase-, XP- und Rucksackarbeit erfolgt erst danach. Vorhandene Funktionen bleiben erhalten.

Aktuelle Architekturunterlagen: [AS_IS](architecture/AS_IS.md), [TARGET](architecture/TARGET.md), [GAP_ANALYSIS](architecture/GAP_ANALYSIS.md), [IMPLEMENTATION_BACKLOG](architecture/IMPLEMENTATION_BACKLOG.md). Konkrete Änderungen, Prüfungen und neue Screenshots: [Phase-1/2-Abnahmebericht](reviews/phase-1-2-acceptance.md). Die folgende Analyse beschreibt zusätzlich die vorherigen Designiterationen; deren alte Phasennummerierung ist historisch.

## Unterlagen und Bestand

Der vom Nutzer korrigierte Pfad **`docs/wyldo_codex_designpaket_v1/`** ist mit Remote-Commit `3234cff` vorhanden. Alle sechs Markdown-Dateien (README, PRODUKTKONZEPT, DESIGNSYSTEM, SCREENS, ABNAHME, CODEX_AUFTRAG), die Quest-JSON und sämtliche Referenzgrafiken wurden gelesen bzw. visuell geprüft. Verbindlich sind die drei großen Mockups, die Original-Fuchsgrafik und der neueste [Phasenauftrag](reviews/phase-1-3-request.md). Der mitgelieferte Alva-/Sternenkompass-Entwurf widerspricht der ausdrücklich beauftragten Schatzgeschichte und wird nicht als neue Quest importiert.

Vorhanden sind Expo SDK 57, deutsche Oberfläche, E-Mail/Passwort und Google-PKCE-Vorbereitung, acht datengetriebene Stationen, unterschiedliche Rätsel/zwei Hinweise, vier digitale Siegel, echte OSM-Karte, GPS-Radius-/Genauigkeitsprüfung, persistenter kontogetrennter Speicher, Offline-Outbox, Supabase-RLS und idempotente Abschlussabzeichen. Der Ausgangsstand bestand 31 Jest-, 40 SQL- und sechs Browserprüfungen.

## Abweichungen zum neuen Mockup

- Bisher überwiegend cremefarbene Karten und schlichte Überschriften; neu gefordert: goldene Rahmen, dunkles Waldgrün, Pergament, Holz-Logo/-Bedienung und immersive Naturillustration.
- Entdecken ohne Suche/Merkliste/Filter. Neue Oberfläche ergänzt diese Funktionen für die tatsächlich vorhandene erste Quest; keine erfundenen zusätzlichen spielbaren Questkarten.
- Questdetails bisher ohne durchgehende Adventure-Komposition. Neuer Bildaufbau mit Wyldo, markanter Typografie, Metadaten, Vorbereitung und großen Aktionen.
- Keine Richtungsoberfläche. Neu: echte Peilungs-/Distanzrechnung, Kartenwechsel, Gerätekompass und klar gekennzeichnete virtuelle Vorschau. Keine Veränderung von Stationsergebnissen durch die Navigationsvorschau.
- Mockup-XP/Level und weitere Questkarten sind Beispieldaten. Übungs-XP werden nur als Vorschau aus lokalem Testfortschritt angezeigt; es wird keine neue reguläre XP-Vergabe behauptet.
- Rucksack und die automatische Ankunft/Begrüßung aus dem Storyboard gehören zum nachgelagerten Ausbau. Die vier Tabs sind korrekt benannt und geordnet. Der Rucksack zeigt vorerst die vorhandene nutzbare Abenteuer-/Siegelübersicht; eine neue vollständige Rucksackmaske bleibt zurückgestellt.

## Neueste Designkorrektur

Für Entdecken gilt inzwischen der helle Chat-Mockup mit Naturkopf, überlappender Suche, cremefarbenen Bildkarten, Filterchips und heller Hauptnavigation. [Aktueller Aufbau](reviews/discovery-layout.md). Die ursprüngliche Analyse unten beschreibt die Abweichungen vom ersten v1-Screen; sie setzt die neuere Nutzerreferenz nicht außer Kraft.

## Konkrete Arbeitsschritte

1. **Abgeschlossen – Phase 1:** Unterlagen suchen, vorhandene Architektur lesen, Abweichungen dokumentieren und Branch `feat/wyldo-adventure-design-review` anlegen.
2. **Abgeschlossen – Phase 2:** Wiederverwendbare Adventure-Komponenten, Entdecken mit Suche/Filtern/Merkliste, Questdetails sowie Karte/Richtung einschließlich Sensor-Lebenszyklus und echter Berechnung umsetzen. Bestehende Spiel- und Backendregeln erhalten.
3. **Abgeschlossen – Phase 3:** TypeScript, Lint, Unit-/UI-Prüfungen, drei Masken im mobilen Browser und bei 320 Pixel Breite prüfen; Screenshots mit Mockups vergleichen und gefundene Abweichungen korrigieren. Pull Request und Prüfbericht zur Freigabe vorbereiten.
4. **Anhalten.** Keine neue XP-Datenbankmigration, kein vollständiger neuer Ankunfts-/Introfluss und keine weiteren Hauptmasken vor der Nutzerfreigabe.

## Externe Voraussetzungen

Öffentlicher Supabase-Key und Provideradministration sind hier weiterhin nicht verfügbar. Acht sichere Stationsorte, eine zusammenhängende geprüfte Weggeometrie und Begehung fehlen. Die fünf online abgeglichenen OSM-Orientierungspunkte ersetzen diese Freigabe nicht. Keine im Mockup gezeigten Kilometer, Minuten oder Richtungshinweise als reale Daten übernehmen. Für Blinzeln/Mundbewegung fehlt ein Rig; die vorhandenen Wyldo-Posen bleiben die Referenz.

Prüfergebnisse und Screenshots: [Designreview](design-review.md). Der ältere [Gesamtprüfbericht](verification.md) beschreibt die vorhandene Grundlage und wird nicht als Nachweis neuer, noch nicht freigegebener Spielfunktionen verwendet.
