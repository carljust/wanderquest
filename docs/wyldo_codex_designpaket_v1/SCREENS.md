# Screens – Codex-Implementierungsspezifikation

**Alle sichtbaren Mockup-Texte sind Referenz, dieser Screenvertrag ist funktional verbindlich.**

| Screen | Inhalt | Aktion / Verhalten | Zustand |
|---|---|---|---|
| 01 Entdecken | Wyldo/Brand, XP-Minihud, Suchfeld, Questkarten in Nähe | Suchen, filtern, Questdetails öffnen | Login → Entdecken; Standort verweigert → Regionssuche |
| 02 Quest-Details | Titelartwork, Storyteaser, Alter, Schwierigkeit, Weglänge, Dauer, XP, Siegel, Sicherheit | Merken; *Zum Startpunkt navigieren* | begonnen → *Fortsetzen* statt Start |
| 03 Navigation Richtung | Quest-HUD, Ziel, Peilpfeil, Distanz, Modusschalter, Pause | Richtung ↔ Karte; Pause | Off-route/ungenauer GPS → Warnung |
| 04 Startpunkt erreicht | Startpunkt-Info, Questkarte | Startpunkt bestätigen (GPS) | Bei ungenauem GPS nicht still freischalten |
| 05 Wyldo Begrüßung | Fuchs, Dialogtext, Audio | Quest starten oder verschieben | Skip/Untertitel |
| 06 Story Intro | Illustration, 4 Siegel, Hauptgeschichte | Weiter → erste Station | Audio optional |
| 07 Navigation Karte | Nutzerpunkt, geprüfter Weg, Zielpin, Distanz, Karte/Richtung | Kartensteuerung, Wechsel, Pause | Offlinekarten optional, fallback |
| 08 Richtungsmodus | Kompass, Peilung, Entfernung, Sicherheitshinweis | Karte, Pause | Sensor-Fehler erklärt |
| 09 Station erreicht | Wyldo, Aufgabenintro | Aufgabe starten | Station nur einmal triggern |
| 10 Rätsel | Frage, Medien, Antworten, Hinweis | Antwort prüfen, Hinweis | Wiederholungen/Feedback |
| 11 Erfolg | Richtige Lösung, Siegel/XP, Wyldo | Weiter | Nicht doppelt belohnen |
| 12 Steinsiegel | 4 Slots, Sammelfortschritt | Weiter | Persistente Inventardaten |
| 13 Nächstes Ziel | Karte/Distanz/Quest-HUD | Navigation starten | nächstes Ziel freigeschaltet |
| 14 Abschluss | Schatz, XP, Erlebnissummary | Abzeichen ansehen | einmaliger Reward |
| 15 Abzeichen | Abzeichenmotiv, Name, Datum | Zum Rucksack | Erhalt serverseitig |

## Zusätzliche Hauptmasken (noch keine vollwertigen Einzelmockups)
- Karte: allgemeine Questsuche mit Questpins, Kurzkarte beim Tap, Detailnavigation; keine aktive Route ohne gestartete Quest.
- Rucksack: abgeschlossene/pausierte Quests, Level, XP, Badges, gesammelte Story-Gegenstände.
- Profil: Konto, Anzeigename, Audio, Barrierefreiheit, Standort-/Datenschutzeinstellungen, Logout.
- Login/Registrierung: Google/optional E-Mail, Kinderprofil-/Einwilligungskonzept vor öffentlichem Launch klären.

## Persistenter Zustandsautomat
`not_started → navigating_to_start → arrived_at_start → intro → navigating_to_station → challenge → station_complete → navigating_to_station … → completed`. `paused` ist ein persistenter Zustand mit vorherigem Wiedereinstiegspunkt; `resume` setzt dort fort. Jede Station hat stabile ID. Fortschritt und Belohnungen müssen idempotent gespeichert werden.

## Datenobjekte
`Quest`, `QuestRoute` (GPX/Geometrie), `Waypoint` (lat/lon, Trigger-Radius, Freigabestatus), `StoryBeat`, `Dialogue`, `Challenge`, `Hint`, `QuestRun`, `ChallengeAttempt`, `RewardGrant`, `Collectible`, `Badge`, `PlayerProfile`. Versionierung des Quest-Contents für laufende Spielstände.
