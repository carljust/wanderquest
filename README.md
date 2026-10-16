# Wyldo

Outdoor-Abenteuer für iOS und Android, auf der bestehenden Expo-57-/React-Native-/TypeScript-Grundlage. Die erste Quest heißt **„Der verlorene Schatz der Externsteine“**. Wyldo ist auch der Name des Fuchses. Es gibt keinen Creator-Modus.

**Stand: spielbarer Entwicklungsmodus; noch keine vollständige Produktabnahme.** Alle acht Stationen funktionieren im Übungslauf. Original-Mockup, ursprüngliche Quest-Datei, freigegebene Fuchs-/Questgrafiken, Supabase-Publishable-Key und geprüfte Stationsorte fehlen in dieser Umgebung. Der Seed bleibt deshalb unveröffentlicht. Es werden weder Koordinaten noch eine freigegebene Wanderroute vorgetäuscht.

## Schnell starten

Node **24.3–24.x**, empfohlen die Version aus `.nvmrc`, und npm 11. Expo Go auf dem Smartphone muss SDK **57** unterstützen.

```bash
npm ci --include=dev
cp .env.example .env.local
npm start
```

QR-Code mit Expo Go scannen. Lokal müssen Rechner und Smartphone normalerweise im selben Netzwerk sein. In GitHub Codespaces ist keine lokale Node-Installation auf dem Mac nötig:

```bash
cd /workspaces/wanderquest
npm ci --include=dev
npm run start:phone
```

Das verwendet den SDK-57-ngrok-Tunnel. Dafür muss das Codespace ausgehende ngrok-Verbindungen erlauben. `EXPO_OFFLINE` darf beim Tunnelstart nicht gesetzt sein. Den alten Expo-Prozess vorher mit `Ctrl+C` beenden. Kein zusätzliches `ngrok` an den Startbefehl anhängen.

Auf der Anmeldeseite **„Ohne Konto im Entwicklungsmodus testen“** wählen, Quest öffnen und **„Übungsabenteuer starten“** drücken. „Ankunft simulieren“ ersetzt ausschließlich in diesem Modus die Anreise. Rätsel, Hinweise, vier Siegel und das Finale lassen sich vollständig testen. Fortschritt und Einstellungen bleiben nach Neustart erhalten. Unter Profil lässt sich der Übungslauf zurücksetzen. Übung und echtes Konto haben getrennte Datenspeicher; Übungsläufe vergeben keine regulären Abzeichen. Release-Bundles deaktivieren den Entwicklungsmodus zusätzlich über `__DEV__`.

Browser: `npm run web`. Der Browser besitzt keine native Bildschirmtastatur und ersetzt keinen Gerätetest.

## Supabase einrichten

Die mitgeteilte Projektadresse steht in `.env.example`. In `.env.local` bzw. den Umgebungsvariablen ergänzen:

```dotenv
EXPO_PUBLIC_SUPABASE_URL=https://rxkvdixavsrakbtmnsao.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
EXPO_PUBLIC_ENABLE_DEV_MODE=true
```

Den **öffentlichen Publishable-Key** aus den Supabase-Projekteinstellungen verwenden; ein älterer öffentlicher Anon-Key ist ebenfalls mit dem Client verwendbar. Niemals `service_role`, Secret-Key oder Datenbankpasswort als `EXPO_PUBLIC_*` hinterlegen. `.env.local` ist ignoriert. Expo nach Änderungen neu starten (`npm start -- --clear`). Der öffentliche Client-Key wird bestimmungsgemäß in die App eingebunden; RLS schützt die Daten.

Migrationen im eigenen Supabase-Projekt in dieser Reihenfolge anwenden, beispielsweise einzeln im SQL Editor:

1. `supabase/migrations/202610160001_wyldo.sql`
2. `supabase/migrations/202610160002_storage.sql`
3. `supabase/seed.sql`

Migrationen einmal ausführen. Der Seed ist wiederholt ausführbar, solange seine Version ein Entwurf ist. Nach Veröffentlichung muss eine **neue Versions-ID** erzeugt werden. Bestehende Accounts erhalten ebenfalls ein Profil. E-Mail/Passwort-Authentifizierung aktivieren, E-Mail-Bestätigung und mindestens 12 Zeichen als Passwortpolicy im Dashboard einstellen. Der Client prüft die Mindestlänge bei Registrierung und Passwortänderung ebenfalls.

Unter Authentication → URL Configuration die tatsächlich verwendeten Rücksprungadressen erlauben: `wyldo://auth/callback`, die konkrete Expo-Go-Development-URL (`exp://…/--/auth/callback`) und für Web die tatsächliche Origin mit `/auth/callback`. Auch die Variante `?next=reset` berücksichtigen. Keine pauschalen Produktionswildcards verwenden. Für Bestätigung und Reset müssen E-Mail-Templates auf Supabases Bestätigungs-/PKCE-Flow eingestellt bleiben. Den angeforderten Link in derselben App und auf demselben Gerät öffnen. Eigene Development Builds mit stabilem `wyldo://`-Schema erleichtern Deep-Link-Tests; Expo-Go-URLs wechseln mit der Entwicklungsumgebung.

Nach Anmeldung lädt die App veröffentlichte Quest-Snapshots und den eigenen Serverstand, keine lokalen Mock-Quests. **Nach dem Seed ist die Live-Liste absichtlich leer:** Originalinhalt und Route sind noch nicht freigegeben. Die Anmeldung kann unabhängig davon geprüft werden. Der Entwicklungsmodus lädt denselben Inhaltsentwurf aus der Quelldatei.

Details zur Veröffentlichung, Storage, Rollen und Serveraktionen: [Backend](docs/backend.md).

## Funktionen und Aufbau

- Registrierung, Login, Logout, Bestätigungs-/Reset-Callback und Passwortänderung über Supabase; geschützte Navigation, persistente Sessions und Token-Erneuerung.
- Start, Questdetails, acht Kapitel mit Text-, Auswahl-, Reihenfolge-, Hör-/Text- und Coderätsel, Hinweise, vier Siegel, Abschluss und Profil.
- Echte Kartenkomponenten: `react-native-maps` auf iOS/Android, Leaflet/OpenStreetMap im Browser. Noch **keine geprüften Stationspunkte oder Wanderlinie**.
- Standortfreigabe, Genauigkeitsprüfung, veraltete/fehlende Signale, konfigurierbarer Radius und bleibende Freischaltung.
- Kontogetrennter lokaler Speicher mit gemeinsamer Speicherung von Fortschritt und Warteschlange; idempotente Serversynchronisierung.
- Quest-Download vorhandener Texte/Medien; keine Kartenkacheln. Neue echte Antworten offline zunächst vorläufig, keine Belohnung vor Serverprüfung.
- Untertitel, deutsche Geräte-Sprachausgabe, Stumm-/Wiederhol-/Überspringsteuerung, Audio-Lebenszyklus, reduzierte Bewegung. **Freigegebenes Figurenasset fehlt**, daher ist Wyldo als Figur noch nicht fertig animiert.

```text
src/domain/               Questtypen, Reihenfolge, GPS-Regeln, Zustandsübergänge
src/features/auth/        Session, sicherer nativer Tokenspeicher, Authentifizierung
src/features/quest/       Datenbankzugriff und Anwendungskontext
src/features/map/         Plattformkarten und Vordergrund-GPS
src/features/dialogue/    Sprach-/Audiodatei-Steuerung und Untertitelzustand
src/features/companion/   Austauschbarer Wyldo-Renderer und Assetvertrag
src/features/offline/     Mediencache, Spielstand und geordnete Synchronisierung
src/app/                  Expo-Router-Ansichten einschließlich Profil/Einstellungen
content/                  Redaktionsentwurf und nur für Entwicklung/Seed gedachte Lösungen
supabase/                 Migrationen und generierter, wiederholbarer Seed
```

Die früheren drei synthetischen WanderQuest-Missionen wurden durch die neue Queststruktur ersetzt. Alte Detail-URLs führen zu den aktuellen Questdetails.

## Prüfen

```bash
npm run check            # TypeScript, ESLint und Jest
npm run test:database    # PostgreSQL/RLS/RPC mit PGlite, ohne externes Konto
npm run test:web         # Chromium: kompletter Übungslauf, Formulare, Neustart
npm run export:web
npm run export:native    # iOS- und Android-JavaScript/Hermes, keine signierten Apps
npm run format:check
```

Für Playwright einmal Chromium mit `npx playwright install chromium` installieren oder `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` auf einen vorhandenen Browser setzen. Cloud: `/usr/bin/chromium`. Testdateien verwenden ausschließlich synthetische Accounts und Testkoordinaten. Sie ändern **nicht** das echte Supabase-Projekt.

Inhaltsänderungen: `content/externsteine.v1.json` und `content/solutions.private.json` bearbeiten, dann `npm run seed:generate`. Nur der explizite Entwicklungsmodus lädt die Lösungen lokal; veröffentlichte Datenbankdokumente enthalten weder Lösungsliste noch vorab lesbare Erfolgsantworten/Hinweistexte.

[Prüfbericht und Screenshots](docs/verification.md) · [Route und Quellenstatus](docs/route-review.md) · [Figurenassets und Animation](docs/companion.md) · [Offline-Verhalten](docs/offline.md)

## Plattformen und Kosten

Die verwendeten Expo-Module sind für SDK 57 installiert. Expo Go genügt zum Übungstest. Diese Umgebung besitzt kein iOS-/Android-Gerät. Ein Hermes-Export ist kein Nachweis für GPS, native Karten, Keychain, E-Mail-Deep-Links, Stimmen oder Bildschirmtastaturen auf einem echten Smartphone.

Für einen eigenen Android-Build ist `GOOGLE_MAPS_ANDROID_API_KEY` nötig; `app.config.ts` übernimmt ihn in die native Kartenkonfiguration. Key auf Package/Signatur beschränken. Google Maps benötigt je nach Kontokonfiguration ein Billing-Konto und kann Nutzungskosten verursachen. iOS verwendet standardmäßig Apple Maps. Kein kostenpflichtiger Dienst und kein EAS-Build wurde hier beauftragt oder gestartet. Supabase-Free-Plan und dessen E-Mail-/Speicherlimits beachten. Browserkarten nutzen die öffentliche OSM-Kachel-Infrastruktur nach deren [Nutzungsrichtlinie](https://operations.osmfoundation.org/policies/tiles/); keine Offline-Pakete oder Vorab-Massendownloads. Attribution bleibt sichtbar. Weitere Lizenz-/Nutzungsbedingungen der Anbieter gelten unverändert.
