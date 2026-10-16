# WanderQuest 🌲

Eine mobile Outdoor-Abenteuer-App für iOS und Android mit **React Native, Expo SDK 58, TypeScript und Expo Router**. Diese erste Version ist eine bewusst kleine, lauffähige Grundlage für die spätere Spielmechanik.

## Was bereits funktioniert

- Startseite mit WanderQuest-Branding und eigens erstellten Landschaftsillustrationen.
- Drei vollständig synthetische Beispielmissionen: Wald, See und Höhenrunde.
- Missionsübersicht mit Suche, Schwierigkeitsfiltern und Merkliste.
- Missionsdetails mit Strecke, Dauer, Aufstieg, Geschichte und Beispielpunkten.
- Geräteübergreifende Navigation zwischen Start, Missionen, Details und Kartenvorschau.
- Lokal gespeicherte Merkliste mit AsyncStorage, einschließlich Fehlerbehandlung.
- Schematische, missionsabhängige Kartenvorschau mit vorbereitetem `react-native-maps`-Adapter für native Geräte.
- Vorbereiteter `expo-location`-Adapter; die App fragt aktuell keinen Standort ab.
- Repository-Schnittstelle, über die später ein Supabase-Backend angebunden werden kann.

**Es gibt noch keine Anmeldung, Supabase-Verbindung, spielbaren Aufgaben, GPS-Verfolgung oder echte Routennavigation.** Alle Namen, Geschichten, Entfernungen und Koordinaten sind erfunden. Die Vorschau ist keine Wanderkarte. Es sind keine Zugangsdaten, API-Schlüssel oder kostenpflichtigen Dienste nötig.

## Voraussetzungen

- Node.js **24.19.0** empfohlen (`.nvmrc`); unterstützt wird Node 24 ab 24.3.0.
- npm 11 (erstellt und geprüft mit 11.9.0).
- Für einen Smartphone-Test: aktuelle **Expo Go** App mit Unterstützung für SDK 58.

## Installation und Start auf dem Smartphone

```bash
git clone https://github.com/carljust/wanderquest.git
cd wanderquest
# Optional, falls nvm installiert ist:
nvm install
nvm use
npm ci
npm start
```

Smartphone und Entwicklungsrechner müssen im selben lokalen Netzwerk sein. Den QR-Code auf Android in Expo Go, auf iOS mit der Kamera scannen. Metro muss auf dem Entwicklungsrechner weiterlaufen. Es ist weder ein Expo-Konto noch ein eigener nativer Build nötig, um diese Version in Expo Go zu testen.

Falls die Verbindung nicht klappt: VPN/Gastnetz-Isolation und die Firewall für den Metro-Port prüfen. Mit `npm start -- --clear` lässt sich der lokale Bundler-Cache neu aufbauen. Ein Tunnel ist kein Bestandteil der Einrichtung.

```bash
npm run web       # Browser-Vorschau
npm run android   # Android-Emulator, falls lokal eingerichtet
npm run ios       # iOS-Simulator, nur auf macOS mit Xcode
```

In der Cloud laufen weder ein Smartphone noch Xcode/Android-Emulatoren. Ein dort gestarteter Metro-Prozess ist nicht automatisch über das lokale Netzwerk deines Smartphones erreichbar. Für den Smartphone-Test das Repository auf dem eigenen Rechner starten. Ein erfolgreicher JavaScript-Export ersetzt keinen Gerätetest.

## Prüfungen

```bash
npm run check          # TypeScript, ESLint, Jest
npm test               # Datenfilter, Persistenz, Standortadapter
npm run export:web     # Web-Bundle nach dist/
npm run export:native  # JavaScript-/Asset-Export für iOS und Android
```

Die nativen Exporte erstellen keine signierten App-Binaries und benötigen keine Apple-/Google-Zugangsdaten.

Die Browsertests prüfen Navigation, Filter, Missionsdetails, die persistente Merkliste, Kartenvorschau und Fehlerzustände in einer mobilen Bildschirmgröße. Sie starten und beenden ihren eigenen Expo-Webserver auf Port 8081:

```bash
npx playwright install chromium
npm run test:web
```

Wenn Chromium bereits installiert ist, kann stattdessen dessen Pfad gesetzt werden:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:web
```

Die Tests simulieren Browser-Bedienung, keine nativen Karten oder echten GPS-Empfang. Auf Linux können zusätzliche Systembibliotheken für Chromium nötig sein (`npx playwright install --with-deps chromium`).

## Projektstruktur

```text
src/
  app/                     Expo-Router-Routen, Layouts und Fehlerseite
    (tabs)/                Entdecken, Missionen, Karte
    mission/[id].tsx       Missionsdetails mit Deep-Link-Unterstützung
  components/              Wiederverwendbare UI und Landschaftsillustration
  theme/                   Gemeinsame Farben und Layouts
  features/
    missions/              Typen, synthetische Daten, Repository, Zustand, Karten
    bookmarks/             Validierung und geordnete AsyncStorage-Schreibzugriffe
    map/                   Schematische Vorschau und ungenutzter nativer Adapter
  services/location.ts     Nur explizit aufrufbarer Vordergrund-Standortadapter
  __tests__/               Jest-Tests
e2e/                       Playwright-Bedienungstests
```

Routen enthalten die Bildschirmansichten; Datenzugriff und Fachlogik liegen außerhalb von `app/`. `MissionProvider` akzeptiert ein `MissionRepository` mit asynchronen `list()`- und `getById()`-Methoden. Standardmäßig verwendet er lokale Daten. Eine spätere Supabase-Implementierung kann diesen Adapter ersetzen; aktuell ist absichtlich weder ein Supabase-Client noch eine Datenbank nötig.

Die Merkliste bleibt lokal auf dem jeweiligen Gerät bzw. im jeweiligen Browser. Sie enthält nur Missions-IDs, keine vertraulichen Daten. Beim Zurücksetzen der App-Daten geht sie verloren. Es gibt keine Synchronisierung zwischen Geräten.

## Karten und GPS später erweitern

Die Detailansicht übergibt `missionId` an `/map`. Der sichtbare Kartenbereich rendert aktuell ausschließlich eine lokale SVG-Skizze. `src/features/map/native-map.native.tsx` enthält einen vorbereiteten `react-native-maps`-Adapter, der noch nicht eingebunden ist. Synthetische Koordinaten dürfen nicht als echte Wege verwendet werden.

`requestForegroundPosition()` ist für eine spätere, ausdrücklich vom Nutzer gestartete Standortaktion vorbereitet. Berechtigungsablehnung und deaktivierte Ortungsdienste werden separat behandelt. Es gibt keine Hintergrundortung.

`react-native-maps`, `expo-location` und AsyncStorage sind mit SDK-kompatiblen Versionen installiert und in Expo Go verfügbar. Für einen späteren eigenständigen Android-Build mit echten Google-Karten ist eine separate Maps-Konfiguration nötig. Das ist nicht Teil dieser Version und es wurde kein kostenpflichtiger Dienst eingerichtet.

## Cloud-Entwicklungsumgebung

Im vorbereiteten Cloud-Checkout liegt das Projekt unter `/workspace/wanderquest`. Falls der Standard-npm-Cache nicht beschreibbar ist, `npm_config_cache=/workspace/.npm-cache` setzen. `XDG_CACHE_HOME=/workspace/.cache` hält auch Debugger-Artefakte im beschreibbaren Workspace. Für die eingeschränkte Cloud-Netzwerkumgebung funktionieren die Expo-Befehle mit `EXPO_NO_TELEMETRY=1 EXPO_OFFLINE=1`; dabei werden lokale SDK-Kompatibilitätsdaten verwendet. Paketdownloads über npm behalten TLS- und Integritätsprüfung bei.

Metro mit Fast Refresh ohne automatischen Browserstart auf der Cloud-Maschine starten:

```bash
env -u CI BROWSER=none XDG_CACHE_HOME=/workspace/.cache \
  EXPO_NO_TELEMETRY=1 EXPO_OFFLINE=1 npm_config_cache=/workspace/.npm-cache \
  npm run web -- --offline --port 8081 --max-workers 2
```

Vorher prüfen, ob Port 8081 bereits von einem eigenen Metro-Prozess genutzt wird. Bei belegtem Port keine fremden Prozesse beenden; den passenden bestehenden Server verwenden oder einen freien Port wählen. `CI=1` ist für automatisierte Prüfungen geeignet, deaktiviert aber den Watch-Modus für die Entwicklung.

Installierte Dateien bleiben im Umgebungssnapshot erhalten; Metro muss in einer neuen Sitzung neu gestartet werden. Wiederverwendbare Installations- und Startanweisungen werden zusätzlich in der Cloud-Umgebungskonfiguration hinterlegt.
