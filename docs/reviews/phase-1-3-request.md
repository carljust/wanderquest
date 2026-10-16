# Entwicklungsauftrag: Wyldo MVP – Design und Spielerlebnis

Du bist Senior React Native Developer, UI/UX Designer und Game Developer.

Entwickle die bestehende Wyldo-App im GitHub-Repository `carljust/wanderquest` weiter.

## 1. Verbindliche Projektunterlagen

Im Verzeichnis `docs/design/wyldo-v1/` findest du:

- `PRODUKTKONZEPT.md`
- `DESIGNSYSTEM.md`
- `SCREENS.md`
- `ABNAHME.md`
- `CODEX_AUFTRAG.md`
- Freigegebene Mockups
- Grafiken unseres Maskottchens Wyldo

Lies zunächst sämtliche Unterlagen und analysiere den vorhandenen Quellcode.

**Die freigegebenen Mockups sind die verbindliche visuelle Referenz.**

## 2. Produktvision

Wyldo ist ein GPS-basiertes Outdoor-Abenteuerspiel für Familien mit Kindern.

Kinder entdecken Quests in ihrer Umgebung, navigieren durch die reale Natur, lösen Rätsel, sammeln Gegenstände, verdienen XP und steigen im Level auf.

Das Design soll wie ein hochwertiges Mobile Adventure Game wirken – farbenfroh, lebendig, immersiv und familienfreundlich.

Die App darf nicht wie eine gewöhnliche Wander-App oder eine generische React-Native-Anwendung aussehen.

## 3. Designanforderungen

Orientiere dich möglichst genau an den Mockups.

- Hochwertige Natur- und Abenteuerillustrationen.
- Waldgrün, warme Goldtöne und natürliche Farben.
- Große, moderne Gaming-Buttons.
- Quest-Karten mit großen Bildern.
- XP- und Level-Anzeigen.
- Fortschrittsbalken und Belohnungseffekte.
- Einheitliche Icons und Typografie.
- Responsive Darstellung auf Android und iOS.
- Wiederverwendbare UI-Komponenten.

Verwende die bereitgestellten Grafiken. Ersetze sie nicht durch beliebige Platzhalter oder Emojis.

## 4. Hauptnavigation

Implementiere vier Hauptbereiche:

1. **Entdecken:** Quests in der Nähe mit Suche und Filtern.
2. **Karte:** Alle verfügbaren Quests als interaktive Pins mit Kurzvorschau und Navigation zur Detailseite.
3. **Rucksack:** Abgeschlossene und pausierte Quests, gesammelte Gegenstände, Abzeichen, XP und Level.
4. **Profil:** Benutzerinformationen und Einstellungen.

## 5. Erste spielbare Mission

Die erste Mission heißt:

**Der verlorene Schatz der Externsteine**

Sie umfasst acht Story-Kapitel und vier sammelbare Steinsiegel.

Der Ablauf:

1. Quest auswählen.
2. Quest-Details anzeigen.
3. Navigation zum Startpunkt starten.
4. Zwischen Karten- und Richtungsmodus wechseln.
5. GPS erkennt das Erreichen des Startpunkts.
6. Wyldo begrüßt den Spieler.
7. Story-Intro anzeigen.
8. Zur Navigation wechseln.
9. Nächste Station erreichen.
10. Wyldo erscheint und stellt eine Aufgabe.
11. Rätsel lösen, Belohnung erhalten.
12. Zur nächsten Station navigieren.
13. Nach Abschluss die Schatzanimation anzeigen.
14. XP vergeben und Abzeichen im Rucksack speichern.

Die Quest muss pausiert und später fortgesetzt werden können.

Verwende echte, verifizierte geografische Daten und sichere Wanderwege. Nicht verifizierte Koordinaten müssen als solche gekennzeichnet und dürfen nicht als fertige Navigation ausgegeben werden.

## 6. Karten- und Richtungsmodus

Beide Modi sind während der Navigation verfügbar.

**Kartenmodus:**

- Reale Kartenintegration.
- GPS-Standort.
- Zielpunkt und Entfernung.
- Geprüfter Wanderweg und Stationspositionen.

**Richtungsmodus:**

- Großer, dynamischer Richtungspfeil.
- Entfernung zum Zielpunkt.
- Automatische Aktualisierung bei Bewegung.
- Klarer Hinweis, dass die Richtung nicht zum Verlassen von Wegen auffordert.

## 7. Wyldo als Begleiter

Der Fuchs Wyldo mit grünem Schal, Rucksack und Kompass ist die zentrale Identifikationsfigur.

Er erscheint bei:

- Quest-Einführungen.
- Dialogen.
- Besonderen Ereignissen.
- Rätseln und Hinweisen.
- Quest-Abschlüssen.

Verwende zunächst die vorhandenen Illustrationen. Bereite die Komponenten für spätere Animationen und Sprachdateien vor.

## 8. Technische Anforderungen

Nutze den vorhandenen Stack mit React Native, Expo und TypeScript.

Die zentrale Datenhaltung erfolgt über Supabase.

Implementiere eine saubere Architektur für:

- Missionen und Stationen.
- GPS-Navigation.
- Dialoge und Rätsel.
- Benutzerfortschritt.
- XP, Level und Abzeichen.
- Offline-Fortschritt und Synchronisierung.

Keine Zugangsdaten fest im Quellcode hinterlegen.

## 9. Vorgehensweise – unbedingt einhalten

**Arbeite in getrennten, überprüfbaren Phasen.**

Phase 1:

- Bestehenden MVP analysieren.
- Abweichungen zu den Mockups dokumentieren.
- Umsetzungsplan erstellen.

Phase 2:

- Designsystem implementieren.
- Startseite „Entdecken“ überarbeiten.
- Quest-Detailseite überarbeiten.
- Navigationsoberfläche für Karte und Richtungspfeil erstellen.

Phase 3:

- Die drei überarbeiteten Hauptmasken im Simulator oder Browser testen.
- Screenshots erstellen und mit den freigegebenen Mockups vergleichen.
- Layoutabweichungen korrigieren.

**Nach Phase 3 anhalten und auf meine Freigabe warten.**

Erst danach sollen die vollständige Quest-Engine, Supabase-Integration und weiteren Masken umgesetzt werden.

## 10. Qualitätssicherung

- Keine unnötigen Änderungen an funktionierenden Komponenten.
- Keine nicht funktionierenden Buttons.
- Keine erfundenen Kartenfunktionen.
- TypeScript-, Lint- und verfügbare UI-Tests ausführen.
- Die App muss lokal startbar bleiben.
- Dokumentiere Änderungen und offene Punkte.
- Erstelle für die Entwicklung einen eigenen Git-Branch und einen Pull Request.

Beginne jetzt mit der Analyse der Projektunterlagen und der bestehenden Anwendung. Erstelle anschließend den Umsetzungsplan und implementiere Phase 2 und 3.
