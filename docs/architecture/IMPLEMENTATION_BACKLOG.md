# Konkreter Umsetzungsplan

## Jetzt autorisiert: Phase 1 und 2

1. **Bestand sichern und dokumentieren:** Branch/Remote prüfen, Originalunterlagen lesen, Ist/Ziel/Lücken dokumentieren. Vorhandenen Check als Ausgangsprüfung ausführen.
2. **Designsystem zusammenführen:** Tokens in `src/theme/tokens.ts`; bestehende Komponenten darauf referenzieren. Wiederverwendbaren Fortschrittsbalken für den Header und eine sichere Quest-Pin-Darstellung ergänzen. Kein neues Paket.
3. **Entdecken:** helle neueste Nutzerreferenz erhalten; XP/Level im Header ergänzen, Such-/Regionsfallback und funktionierende Filter behalten. Keine fiktiven zweiten Quests oder verdienten XP.
4. **Questdetails:** Altersstatus, Startpunkt und Belohnung sichtbar ergänzen. Acht Kapitel, vier Siegel, lesende Sterne und die bestehende Navigation erhalten. Ungeprüfte Strecken-/Zeitwerte offen ausweisen.
5. **Navigation:** zentrale Projektion freigegebener Karte/Ziel/Standortdaten für Web/WebView, Zielpin, Genauigkeitskreis und freigegebener Track. Richtungsberechnung/Simulation nicht mit Feldfortschritt verbinden. Umschaltung und Pause regressionsprüfen.
6. **Abnahme:** TypeScript/Lint/Jest je Abschnitt, Browserfluss einschließlich Suche/Details/Wechsel und Fehlerpfaden, neue Aufnahmen auf 360×800, 320×640 und 390×844. Mit den Referenzen vergleichen, konkrete Abweichungen korrigieren. Web-/Hermesexports, Dokumentation und PR aktualisieren.
7. **Stopp nach Phase 2:** Designfreigabe anhand Screenshots/PR. Keine neuen Supabase-, Engine- oder Rewardverträge.

## Danach nur nach Freigabe

| Reihenfolge | Paket                      | Voraussetzung                                 | Abnahme                                                       |
| ----------- | -------------------------- | --------------------------------------------- | ------------------------------------------------------------- |
| P3          | Live-Auth/Content/Storage  | öffentlicher Key, Provideradministration      | Konto, Reset, Google, RLS, veröffentlichte Version live       |
| P4          | reale Stationsnavigation   | geprüfte Koordinaten/Track, Begehung          | Genauigkeit, Ankunftstabilität, Sensoren und Wege auf Geräten |
| P5          | explizite Questmaschine    | freigegebener Zustandsvertrag                 | Intro/Ankunft/Pause/Resume/Offline, keine doppelten Events    |
| P6          | finale Schatzquest         | redigierte Originaltexte/Medien, sichere Orte | acht Kapitel, vier Siegel, Kristallfinale                     |
| P7          | reguläre XP/Level/Rucksack | freigegebene Ökonomie und Serverledger        | einmalige XP/Badge, kontenübergreifend isoliert, Restore      |
| P8          | geschlossener Feldtest     | obige Pakete, reale Geräte und Erwachsene     | kompletter Weglauf, Ausfälle/Offline, sichere Bedienung       |

Abhängigkeiten und Nichtnachweise stehen in [GAP_ANALYSIS](GAP_ANALYSIS.md). Die konkreten Ergebnisse dieses Durchgangs stehen im [Phase-1/2-Bericht](../reviews/phase-1-2-acceptance.md).
