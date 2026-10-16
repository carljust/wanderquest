# Wyldo-Charaktervertrag

Im Repository waren ausschließlich ein generisches Launcher-Icon und eine alte Landschaftskomponente vorhanden. Kein freigegebener Fuchs mit grünem Schal, Rucksack und Kompass, kein Character-Rig, keine Questbilder, kein Rive-/Lottie-Asset oder Ton lag vor. Die alte generische Landschaft wurde entfernt. Es wurde kein Ersatzmaskottchen erzeugt.

`WyldoCompanion` bekommt nur Darstellungszustand, Wortimpuls und reduzierte Bewegung. Dialog-/Questregeln liegen getrennt davon. Zustände: idle, talk, think, surprise, celebrate und wave; eine Begrüßung ist derzeit **nicht grafisch unterstützt** (`supportsWave=false`). Ein zukünftiger Rive-Renderer kann denselben Zustandsvertrag übernehmen.

Aktuell erscheint ein ausdrücklich benannter neutraler Platzhalter. Damit gibt es **keine fertig animierte Fuchsfigur**, kein sichtbares Blinzeln oder Mundspiel am genehmigten Fuchs und keine überprüfte Endqualität eines Rigs. Die Implementierung bietet einen begrenzten Renderer für passende Ebenen, aber dessen Grafikqualität kann ohne Ebenen nicht geprüft werden.

## Benötigte Assets

1. Freigegebener transparenter Portrait-PNG als kurzfristige statische Figur. Dieser erhält ausschließlich geringe Gesamtbewegung; darauf werden keine fremden Augen oder Münder gezeichnet.
2. Für Blinzeln/Mundbewegungen gleich große transparente Ebenen im identischen Koordinatensystem: Körper ohne zweiten Kopf, Kopf ohne Augen/Mund, offene und geschlossene Augen, ruhender und sprechender Mund. Keine Gesichtszüge dürfen auf mehreren Ebenen enthalten sein. Grünem Schal, Rucksack und Kompass müssen Form und Position konsistent bleiben. Alternativ ein vollständig geriggtes Rive-Asset mit dokumentierten State-Machine-Eingängen; Rive-Abhängigkeit und Development Build erst dann einrichten.
3. Für echtes Winken eine passende Arm-/Pfotenanimation. Diese ist nicht durch Gesamtbilddrehen zu ersetzen.
4. Acht genehmigte Questillustrationen und gegebenenfalls deutsche Dialogaufnahmen. Zuordnung über den Inhalts-/Storage-Assetkatalog.

Portrait/Ebenen in `src/features/companion/assets.ts` statisch referenzieren. Keine Webgrafiken oder fremden Tiere als finale Figur einsetzen. Mundzustände werden bei TTS aus verfügbaren **Wortgrenzen** vereinfacht angestoßen. Das ist weder gemessene Audio-Amplitude noch Visem-/Phonemsynchronisation; für Audiodateien liegen keine Zeitmarken oder Mundimpulse vor. Aufnahmen lassen sich abspielen, erhalten aber keine behauptete präzise Lippensynchronisation.

Deutsche TTS benötigt eine installierte Gerätestimme; deren Offline-Verfügbarkeit und iOS-Stummschalter sind geräteabhängig. Text ist immer vollständig vorhanden. Stumm, Überspringen, Wiederholen und Verlassen stoppen die Ausgabe. Bewegung wird durch App-Einstellung **oder** Systemeinstellung reduziert. Die tatsächliche visuelle Rig-Abnahme und Stimme müssen auf iOS/Android nachgeholt werden.
