# Wyldo: Figur, Bilder und Animationsumfang

Die Nutzerreferenz zeigt Wyldo mit grünem Schal, Rucksack und Kompass in vier Posen. Daraus wurde ein transparentes Posen-Atlas für die App aufbereitet (`assets/design/wyldo-poses.png`). Die ergänzten Szenen zeigen Externsteine, Waldbach, Runa und Kristallschatz. Vier Steinsiegel ergänzen das freigegebene Mockup. Ein Wyldo-Porträt ersetzt das generische Launcher-Icon. Herkunft und Grenzen stehen in `assets/design/manifest.json`.

Die ergänzten Landschaftsbilder sind **generierte Abenteuerillustrationen**, keine dokumentarischen Ortsfotos oder Belege einer Route. Die Posen sind aus der gelieferten Charakterreferenz abgeleitet; sie ersetzen kein Original-Character-Rig. Die Inline-Vorlagen liegen im Repository nicht als unveränderte Quelldateien vor. Für eine pixelgenaue endgültige Auslieferung sollten die freigegebenen Originalexports separat archiviert werden.

## Tatsächlich implementiert

`WyldoCompanion` trennt Darstellung von Quest, Dialog und Audio. Der Zustandsvertrag bleibt `idle`, `talk`, `think`, `surprise`, `celebrate`, `wave`. Zustände wählen eine passende der vier Ganzbildposen und begrenzte Gesamtbewegungen:

- Idle: ruhige Standpose mit geringer Auf-/Abbewegung.
- Talk / Surprise: aufmerksam-fröhliche Pose; keine behauptete Mundsynchronisation.
- Think: Standpose mit leichter Gesamtneigung.
- Celebrate: Jubelpose mit kleiner Auf-/Abbewegung.
- Wave: vorhandene Begrüßungspose mit erhobener Pfote; kein separat animierter Arm.

Es gibt **keine unabhängig beweglichen Gesichts-/Körperteile**, kein echtes Blinzeln, keinen animierten Mund und keine Lippensynchronisation im aktuellen Posen-Renderer. Keine fremden Augen/Münder werden auf die PNGs gezeichnet. Die Reduzierung von Bewegung berücksichtigt sowohl App- als auch Systemeinstellung.

Der optionale Ebenenrenderer und die `mouthPulse`-Schnittstelle sind vorbereitet, aber ohne geeignete Grafik nicht aktiviert. Deutsche Geräte-TTS liefert gegebenenfalls Wortgrenzen als vereinfachte Steuerimpulse. Das ist weder gemessene Audio-Amplitude noch zeitgesteuerte Phonem-/Visem-Synchronisation. Der Renderer kann später durch Rive ersetzt werden; eine Rive-Integration wurde nicht vorgetäuscht.

## Noch benötigtes Rig

Entweder ein hochwertiges Rive-Asset mit dokumentierten State-Machine-Eingängen oder transparente, deckungsgleiche Ebenen im gleichen Koordinatensystem: Körper ohne zweiten Kopf, Kopf ohne Augen/Mund, offene/geschlossene Augen sowie Ruhe-/Sprechmund. Pfote/Arm brauchen für echtes Winken eine eigene Ebene und einen passenden Drehpunkt. Gesichtszüge dürfen nicht doppelt in den Ebenen liegen. Assetvertrag: `src/features/companion/assets.ts`.

Deutsche Sprachausgabe benötigt eine installierte Gerätestimme; Offline-Verfügbarkeit und Stummschalterverhalten sind geräteabhängig. Untertitel bleiben vollständig lesbar. Stumm, Überspringen, Wiederholen und Verlassen stoppen die Ausgabe. Sprachaufnahmen sind derzeit nicht beigefügt. Die tatsächliche native Stimme und die spätere Rig-Qualität müssen auf iOS/Android geprüft werden.
