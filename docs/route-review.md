# Externsteine: Route und Quellenstatus

**Noch keine Outdoor-Route freigegeben.** Fünf reale Orientierungspunkte wurden am 16.10.2026 direkt über die OSM-API abgerufen und exakt mit der beigefügten Referenzdatei abgeglichen. Diese Punkte sind keine acht freigegebenen Queststationen. Alle acht Stationswerte `point` bleiben `null`, die Wanderroute ein leeres Array und `fieldReady=false`. Strecke und Dauer werden nicht als gemessen ausgegeben.

## Erfolgreich abgerufene Orientierungspunkte

Maschinenlesbare Herkunft: `content/routes/externsteine-reference-points.json`. Jeder API-Abruf lieferte HTTP 200 mit genau diesen Koordinaten:

| OSM-Objekt                                                         | Bezeichnung                          | Breitengrad | Längengrad |
| ------------------------------------------------------------------ | ------------------------------------ | ----------- | ---------- |
| [node/10544136713](https://www.openstreetmap.org/node/10544136713) | Wegweiser „Infozentrum Externsteine“ | 51.8683056  | 8.9236213  |
| [node/5909732105](https://www.openstreetmap.org/node/5909732105)   | Knickenhagen IV                      | 51.8650817  | 8.922974   |
| [node/5483282172](https://www.openstreetmap.org/node/5483282172)   | Externsteine Naturerlebnispfade      | 51.86788    | 8.9157458  |
| [node/5483282173](https://www.openstreetmap.org/node/5483282173)   | Externsteine Südseite                | 51.8684932  | 8.9167329  |
| [node/7122025636](https://www.openstreetmap.org/node/7122025636)   | Externsteine                         | 51.8689687  | 8.9178219  |

Prüfstatus: `desk_checked` = OSM-Objekt/Name/Koordinate online gelesen. Das bestätigt weder die aktuelle Zugänglichkeit noch eine sichere Spielfläche. Besonders der erste Punkt bezeichnet einen **Wegweiser**, nicht nachweislich das Gebäude des Infozentrums. Die App kennzeichnet die Punkte als Orientierung, zeichnet keine Verbindungslinien und nutzt sie nicht als GPS-Auslöser.

Die Kartenmitte `51.869, 8.917` ist ausschließlich eine regionale Ansicht. Eine spätere Wanderlinie muss eine belegte Weggeometrie enthalten; Stationszentren dürfen nicht durch Luftlinien verbunden werden.

## Weitere Quellen und offene Prüfung

Die beigefügte `wyldo_externsteine_mission_seed.json` ist unverändert unter `content/references/user-quest-seed.json` archiviert. Ihr Text enthält fünf Alva-/Sternenkompass-Stationen und widerspricht damit der ausdrücklich beauftragten Wyldo-Schatzgeschichte. Sie wird als Orts-/Quellenreferenz genutzt, nicht als spielbarer Inhalt importiert. Die App behält acht Stationen, Runa, vier Siegel und das Kristallfinale.

Die Datei nennt die [Kinder-Erlebnis-Route Knickhagen OH6](https://www.teutoburgerwald.de/natur/in-der-natur/tour/kinder-erlebnis-route-knickhagen-an-den-externsteinen-oh-6) samt GPX-Export. Offizielle Seite und GPX konnten wegen HTTP-Proxy 403 **nicht gelesen** werden. Die dort im Anhang behaupteten 2,55 km/85 Minuten wurden nicht bestätigt oder übernommen. Auch [Betreiberinformationen](https://www.externsteine-info.de/) waren in dieser Umgebung nicht lesbar. Ein Overpass-Abruf lieferte 406; daraus wurde keine Weggeometrie konstruiert.

## Vor Veröffentlichung und vor Ort

Acht sichere Aufenthaltsorte an einem zusammenhängenden, freigegebenen Weg auswählen. Für jeden Punkt Objekt/ID/Version oder amtliche Herkunft, Zugangsrecht, Datum und Unsicherheiten dokumentieren. Tatsächliche Weggeometrie, Sperrungen, Treppen, Tore, Steigungen und Schutzbereiche prüfen. Eine Begehung muss GPS-Empfang, Radius/Genauigkeit, Aufenthaltsfläche, Start-/Rückweg und Dauer bestätigen. Erst danach ist `field_checked` angemessen. Keine Felsspitzen, Kletterstellen, Gegenstände oder Verstecke abseits der Wege. Alle Siegel und Belohnungen sind digital.

## Karten und Betrieb

Web und iOS/Android verwenden Leaflet 1.9.4 mit OpenStreetMap-Rasterkacheln. Auf dem Smartphone liegt Leaflet samt CSS im Bundle und wird in `react-native-webview` angezeigt; es gibt keine Laufzeitabhängigkeit von einem JavaScript-CDN und keinen Google-Maps-Key. Die vorherige native Maps-Abhängigkeit wurde entfernt. Der Schritt behebt die Schlüsselplicht eigener Android-Builds und macht die Darstellung plattformübergreifend gleich.

Der echte Kachelabruf wurde im Cloud-Chromium über den vorgesehenen HTTPS-Proxy geprüft (sechs Antworten HTTP 200), zusätzlich sind Fehler/Wiederholung und der native HTML-/Daten-Bridge-Code browsergetestet. Ein nativer Smartphone-Start ist noch offen. Attribution bleibt in der Karte sichtbar. Die öffentliche OSM-Infrastruktur unterliegt der [Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/) und besitzt keine zugesicherte Verfügbarkeit; für größeren Betrieb einen geeigneten Anbieter prüfen. Es werden keine Kartenkacheln für Offline-Nutzung vorgeladen. Karten benötigen Internet; heruntergeladene Texte und GPS-Regeln bleiben unabhängig davon verfügbar.
