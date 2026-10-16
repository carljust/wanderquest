# Entdecken – neuer Aufbau nach Chat-Mockup

Stand: 16.10.2026. Der zuletzt im Chat gelieferte helle OpenQuest-Screen ist die neue verbindliche **Aufbaureferenz für Entdecken**. Er ersetzt für diese Maske das dunkle Holz-/Pergamentlayout aus `docs/wyldo_codex_designpaket_v1/`. Die Originaldatei dieses neuen Screens wurde nur als Chatbild übermittelt und liegt nicht als lokale Referenz-PNG vor. Es wird keine nachgezeichnete Datei als Original ausgegeben. Die App und der orangefarbene Fuchs bleiben gemäß dem bestehenden Auftrag **Wyldo**; ein Wechsel zu OpenQuest oder zum grünen Ersatzmaskottchen wurde nicht beauftragt.

## Umgesetzt

- Breiter, heller Naturkopf mit neuer, separat generierter Landschaft. Grüner Wyldo-Schriftzug, Begrüßung und Original-Fuchs; keine eingebrannten UI-Texte im Hintergrundbild.
- Weiße, pillenförmige Suche über dem Übergang zum cremefarbenen Inhaltsbereich; Such- und Filteraktionen sind echte zugängliche Bedienelemente.
- Regionale Questübersicht mit einer großen empfohlenen Bildkarte. Titel, klare Pfeilaktion und kompakte Metadaten zu Strecke, Dauer, Alter und Rätsel-Schwierigkeit. Die eigene Karte öffnet die echte vorhandene Questdetailseite.
- Zwei kleinere funktionale Karten unterhalb: Kapitel-/Siegelübersicht und Offline-Speichern der tatsächlichen ersten Quest. Die zusätzlichen Beispielquests des Mockups werden nicht als spielbare Angebote erfunden.
- Filterchips Alter, Dauer, Distanz und Schwierigkeit mit einem bedienbaren Auswahlfenster. Merkliste und Offlinefilter bleiben erhalten. Zurücksetzen, Schließen, Anwenden und Android-Zurück sind unterstützt.
- Helle Hauptnavigation mit Entdecken, Karte, Rucksack und Profil. Die Rucksackmarkierung zeigt ausschließlich tatsächlich gesammelte Siegel. Der bisherige Wiederaufnahme-Einstieg und Übungs-XP bleiben beim begonnenen Lauf erhalten.

## Daten und Grenzen

Es gibt weiterhin eine erste echte Questdefinition und keine fertige Outdoor-Freigabe. Deshalb heißt die Rubrik „Quests entdecken“ mit expliziter Externsteine-Region und Kartenaktion; es wird keine ungeprüfte Nähe zum aktuellen Standort behauptet. Mockup-Altersgruppen, Minuten und Kilometer werden nicht übernommen. Fehlende Angaben stehen offen in der Karte.

Numerische Filter verwenden das optionale `listing` des Questdokuments mit `minimumAge`, `durationMinutes` und `distanceKm`. Fehlende, nicht endliche oder negative Werte erfüllen keinen entsprechenden Filter. Zeit und Distanz dürfen erst bei `fieldReady=true` als passende Messwerte erscheinen; die Prüfung ist keine neue Routenfreigabe. Ohne Einschränkung bleibt die Entwurfsquest auffindbar. Der Schwierigkeitsfilter nutzt die tatsächlich hinterlegte Rätsel-Schwierigkeit. Diese Regeln, Grenzwerte sowie kombinierte Such-/Merk-/Offlinefilter sind automatisiert geprüft.

Die zweispaltigen Filterchips und die Metadaten umbrechen auf kleinen Displays zugunsten lesbarer Texte und mindestens etwa 44 dp großer Aktionen. Die Seite scrollt vertikal. Die niedrige Ansicht wurde zusätzlich auf überlappende Kopftexte und horizontalen Überlauf geprüft. Native Tastatur und reale Safe Areas bleiben Teil der Geräteabnahme.

## Aufnahmen und Prüfungen

- [Entdecken 360×800](../screenshots/design-v1/01-discover.png)
- [Entdecken 320×640](../screenshots/design-v1/01-discover-small.png)
- [Kleine Aktionskarten und Filterchips](../screenshots/design-v1/01-discover-actions.png)
- [Geöffnetes Filterfenster](../screenshots/design-v1/01-discover-filters.png)

Der [Gesamtbericht](../design-review.md) dokumentiert die abschließenden Befehle und tatsächlichen Ergebnisse. Die App wurde visuell in der laufenden mobilen Browseransicht geprüft. Keine echte Smartphone-, Supabase- oder Routenabnahme wird dadurch ersetzt. Der weitere Ausbau hinter dem vereinbarten Design-Freigabepunkt bleibt ausgesetzt.
