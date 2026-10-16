# Korrektur: AudioPlayer.pause beim Start oder Ansichtswechsel

Gemeldete Meldung: `Call to function 'AudioPlayer.pause' has been rejected.`

Der Dialoghook erzeugte mit `useAudioPlayer(null)` bereits ohne Audiodatei einen nativen Player. Expo SDK 57 gibt diesen beim Unmount automatisch frei. Der danach laufende Fokus-Cleanup rief nochmals `player.pause()` auf. Auch der anfängliche Stummmodus pausierte den unbenutzten Player ungeprüft.

Die Freigabereihenfolge wurde im Komponentenmock entsprechend dem installierten Expo-Hook nachgestellt. Der bisherige Code erzeugte damit exakt die gemeldete Fehlermeldung beim Unmount. Das ist eine reproduzierte Lifecycle-Regression, kein nativer Gerätetest.

## Änderung

- Text und deutsche Geräte-Sprachausgabe erzeugen keinen leeren AudioPlayer mehr.
- Nur eine tatsächlich gestartete Audiodatei erhält einen Player über die dokumentierte SDK-57-API `createAudioPlayer`.
- Der Dialoghook besitzt diese Ressource selbst. Überspringen, Stummschalten, Aufnahmeende und Verlassen entfernen Listener und geben den Player einmalig frei. Kein anschließender `pause()`-Aufruf.
- Verspätete Sprach-/Aufnahmeereignisse können keinen neueren Dialog schließen oder nach Verlassen Audio starten.
- Fehler beim Audiostart erhalten den vollständigen Text und erlauben erneutes Abspielen. Native Teardownfehler unterbrechen die Navigation nicht.
- Keine neuen Abhängigkeiten, keine Änderung an Questdaten, Speicherung oder Backendverträgen.

## Tatsächliche Prüfungen

`npm run check`: TypeScript, ESLint ohne Warnungen und **62 Tests in 13 Suiten** bestanden. Die zehn Dialogtests prüfen TTS, Stummmodus, Skip/Replay, verspätete Ereignisse, Aufnahmefreigabe bei Skip/Stumm/Unmount/Ende, Startfehler mit Wiederholung und abgewiesene Aufräumoperationen. Der zuvor fehlgeschlagene Reproduktionsfall besteht mit der Korrektur.

`npm run test:web -- e2e/app.spec.ts`: **vier Fälle bestanden**, einschließlich Appstart/SDK-57-Manifest, vollständiger achtteiliger Übung mit Dialogsteuerung, Formularen und Offline/Neustart. iOS-/Android-Hermesexport erfolgreich. Expo-Konfiguration löst `Wyldo`, SDK `57.0.0` und alle drei Plattformen auf. Formatierung und `git diff --check` bestanden.

Die Tests ersetzen keine erneute Prüfung in der Expo-Go-Installation des Nutzers. Keine weiteren Design-/Spielphasen begonnen; die Designfreigabe bleibt ausstehend.

## Aktualisieren

Im Codespaces-/Projektterminal zuerst den alten Expo-Prozess mit `Ctrl+C` beenden. Lokale Änderungen vorher sichern, dann den Review-Branch aktualisieren:

```bash
git switch feat/wyldo-adventure-design-review
git pull --ff-only origin feat/wyldo-adventure-design-review
npm run start:phone
```

Expo Go schließen und den **neu erzeugten QR-Code** verwenden. Falls der Branch noch nicht lokal vorhanden ist: zuerst `git fetch origin feat/wyldo-adventure-design-review`, dann `git switch -c feat/wyldo-adventure-design-review FETCH_HEAD`. Keine Neuinstallation von Node oder Löschung des Spielstands erforderlich.
