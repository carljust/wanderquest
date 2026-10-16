# Wyldo – Entwicklungsauftrag Phase 1 & 2

Du bist Senior React Native Developer, Mobile Game UI/UX Designer und Softwarearchitekt.

Entwickle meine bestehende Outdoor-Abenteuer-App **Wyldo** im GitHub-Repository `carljust/wanderquest` weiter.

## 1. Verbindliche Projektunterlagen

Lies vor Beginn folgende Dateien:

- `docs/specs/PFLICHTENHEFT.md`
- `docs/design/wyldo-v1/PRODUKTKONZEPT.md`
- `docs/design/wyldo-v1/DESIGNSYSTEM.md`
- `docs/design/wyldo-v1/SCREENS.md`
- Alle freigegebenen Mockups unter `docs/design/wyldo-v1/`

Falls Unterlagen fehlen, melde dies ausdrücklich. Erfinde keine fehlenden Spezifikationen.

Die freigegebenen Mockups sind die verbindliche visuelle Grundlage.

## 2. Produktvision

Wyldo ist ein GPS-basiertes Outdoor-Abenteuerspiel für Familien mit Kindern.

Kinder erleben spannende Geschichten in der realen Natur, lösen Rätsel, sammeln Gegenstände, erhalten XP und steigen im Level auf.

Die Anwendung soll wie ein hochwertiges Mobile Adventure Game wirken.

**Wichtig: Wyldo ist ein Spiel, keine klassische Wander-App.**

## 3. Phase 1 – Projektanalyse

Analysiere zunächst das bestehende Repository.

Prüfe insbesondere:

- Aktuelle React-Native-/Expo-Architektur
- Vorhandene Screens und Navigation
- Bestehende Komponenten und Grafiken
- Missionsdaten und Datenzugriff
- Kartenintegration und GPS-Funktionen
- Technische Schulden und bekannte Fehler
- Abweichungen zu den freigegebenen Mockups

Erstelle daraus einen konkreten technischen Umsetzungsplan.

Erhalte bestehende funktionsfähige Komponenten, sofern sie zum Zielkonzept passen.

## 4. Phase 2 – Design und Hauptmasken

Implementiere ein einheitliches, hochwertiges Designsystem anhand der Mockups.

### Maske 1 – Entdecken

Nach der Anmeldung gelangt der Nutzer auf die Entdecken-Seite.

Implementiere:

- Wyldo-Branding
- XP- und Levelanzeige im Header
- Hochwertige Quest-Grafiken
- Anzeige von Quests in der Nähe
- Suchfunktion für Quests und Orte
- Filtermöglichkeiten
- Quest-Karten mit Titel, Bild, Schwierigkeit, Dauer und Entfernung
- Navigation zur Quest-Detailseite

Die erste hervorgehobene Quest heißt **„Der verlorene Schatz der Externsteine“**.

### Maske 2 – Quest-Details

Implementiere:

- Großes Quest-Titelbild
- Quest-Titel und Storybeschreibung
- Schwierigkeitsgrad
- Altersempfehlung
- Strecke und geschätzte Dauer
- Verfügbare XP und Belohnungen
- Anzahl Kapitel und sammelbare Gegenstände
- Hinweise zur Sicherheit
- Startpunktinformationen
- Button „Zum Startpunkt navigieren“

Die Quest umfasst acht Kapitel und vier sammelbare Steinsiegel.

### Maske 3 – Navigation

Implementiere zwei umschaltbare Navigationsmodi.

**Kartenmodus:**

- Echte Kartenkomponente
- Standortmarker
- Zielmarker
- Stationsinformationen
- Anzeige der Entfernung zum Ziel
- Vorbereitete Darstellung eines geprüften Wanderwegs

**Richtungsmodus:**

- Großer, animierter Kompasspfeil
- Richtungsberechnung anhand von GPS-Position und Zielkoordinaten
- Anzeige der verbleibenden Luftlinienentfernung
- Aktualisierung bei Bewegung
- Hinweis, auf den vorhandenen Wegen zu bleiben

Die Navigation muss zwischen Karten- und Richtungsmodus wechseln können, ohne den aktuellen Navigationszustand zu verlieren.

Für die technische Entwicklung darf ein GPS-Simulationsmodus verwendet werden.

## 5. Hauptnavigation

Verwende vier Hauptmenüpunkte:

1. Entdecken
2. Karte
3. Rucksack
4. Profil

Die Menüpunkte sollen optisch zum Adventure-Game-Design passen.

Im Menüpunkt Karte werden Quests später über eigene Quest-Pins dargestellt.

Während einer aktiven Quest soll die allgemeine Hauptnavigation durch die Quest-Navigation ersetzt werden können.

## 6. Wyldo als Maskottchen

Nutze ausschließlich die bereitgestellten Fuchsillustrationen als Designreferenz.

Wyldo ist ein orangefarbener Fuchs mit grünem Schal, Rucksack und Kompass.

Er erscheint später bei Quest-Einführungen, Dialogen, Ereignissen und Rätseln.

Implementiere für Phase 2 zunächst die erforderlichen visuellen Grundlagen. Eine vollständige Charakteranimation ist noch nicht erforderlich.

## 7. Technische Vorgaben

- React Native mit Expo und TypeScript
- Expo Router
- Wiederverwendbare UI-Komponenten
- Zentrale Design-Tokens
- Bestehende Funktionen möglichst erhalten
- Keine fest codierten Zugangsdaten
- Keine unnötigen neuen Abhängigkeiten
- Kompatibilität mit Android und iOS berücksichtigen

Verwende die vorhandene Projektarchitektur als Ausgangspunkt.

## 8. Designqualität

Das Design soll möglichst genau den freigegebenen Mockups entsprechen.

Achte besonders auf:

- Charaktervolle Gaming-Oberflächen
- Hochwertige Hintergrundillustrationen
- Große, gut lesbare Bedienelemente
- Konsistente Farben und Schriften
- Einheitliche Quest-Karten
- Saubere Abstände und Proportionen
- Responsives Layout
- Gute Bedienbarkeit im Freien

Keine generischen Platzhalter, willkürlichen Emojis oder einfachen Standardlisten als Ersatz für die vorgesehenen Gaming-Komponenten.

## 9. Umsetzung und Tests

Arbeite in folgender Reihenfolge:

1. Repository und Projektunterlagen analysieren.
2. Technischen Umsetzungsplan dokumentieren.
3. Designsystem implementieren.
4. Entdecken-Seite umsetzen.
5. Quest-Detailseite umsetzen.
6. Karten- und Richtungsmodus entwickeln.
7. Navigation und Funktionen testen.
8. Screenshots der drei Hauptmasken erstellen.
9. Screenshots mit den Mockups vergleichen.
10. Erkannte Abweichungen korrigieren.

Führe TypeScript-Prüfungen, Linting und verfügbare automatisierte Tests aus.

Erstelle einen eigenen Entwicklungsbranch und einen Pull Request.

## 10. Verbindliche Abnahmekriterien

Phase 2 ist erst abgeschlossen, wenn:

- Die drei Hauptmasken implementiert sind.
- Das Design erkennbar den freigegebenen Mockups entspricht.
- Die Quest-Suche funktioniert.
- Quest-Karten zur richtigen Detailseite führen.
- Die Detailseite die erforderlichen Informationen zeigt.
- Der Navigationsbutton die Navigationsansicht öffnet.
- Karten- und Richtungsmodus umgeschaltet werden können.
- Die Richtungsberechnung mit simulierten Koordinaten getestet wurde.
- Die App ohne kritische Fehler startet.
- Screenshots und Testergebnisse vorliegen.

Kennzeichne unfertige oder noch nicht verifizierte Funktionen ausdrücklich.

**WICHTIG: Nach Abschluss von Phase 2 stoppen und auf meine Freigabe warten.**

Beginne nicht eigenständig mit Supabase, der vollständigen Quest-Engine oder den späteren Entwicklungsphasen.

Liefere mir zunächst die drei Hauptmasken in hoher visueller Qualität.