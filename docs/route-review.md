# Externsteine: Route und Quellenstatus

**Keine Route freigegeben, keine Stationskoordinate als geprüft übernommen.** Die drei früheren Missionen enthielten ausschließlich synthetische Daten anderer Gebiete; daraus wurde kein Externsteine-Punkt übernommen. Alle acht `point`-Werte sind `null`, alle Stationsorte lediglich Vorschläge, die Route ein leeres Array. Strecke und Dauer werden nicht geschätzt.

Die Kartenmitte `51.869, 8.917` dient ausschließlich der regionalen Orientierung in der interaktiven Grundkarte. Sie ist weder Startpunkt noch Station oder geprüfte Wegeinformation. Es gibt keine Polyline durch Stationszentren. Eine spätere Wanderlinie muss eine echte, quellenbelegte Weggeometrie enthalten.

## Rechercheversuch vom 16.10.2026

| Quelle                                                                   | Zweck                                                                 | Tatsächlicher Prüfstatus                                                 |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| https://www.externsteine-info.de/                                        | Betreiberinformationen, Zugänglichkeit, Öffnungen, Wege-/Schutzregeln | HTTP-Proxy verweigert Zugriff (403); Inhalt nicht gelesen oder bestätigt |
| https://www.openstreetmap.org/api/0.6/map?bbox=8.911,51.862,8.923,51.873 | Öffentliche Weg- und Ortsobjekte im Gebiet                            | HTTP-Proxy verweigert Zugriff (403); keine Geodaten übernommen           |
| https://api.openstreetmap.org/ und https://overpass-api.de/              | Vorgesehene OSM-Recherche nach Netzwerkfreigabe                       | Nicht als erfolgreich abgerufen ausgegeben                               |

Die benötigten Hostnamen wurden im Cloud-Konfigurationsentwurf ergänzt. Speichern des Entwurfs aktiviert sie nicht automatisch auf der laufenden Maschine. Es gibt keine erfolgreiche Online-Quellenprüfung, keine Aussage über aktuelle Sperrungen und keine Begehung.

## Noch vor Ort zu prüfen

Acht geeignete Haltepunkte entlang **eines zusammenhängenden freigegebenen Wegs** auswählen. Jeden Punkt mit präziser Herkunft (OSM-Typ/ID/Version oder offizieller Geodatensatz), Koordinate, Zugangsrecht, Datum und Unsicherheiten dokumentieren. Wege nicht durch Luftlinien ersetzen; Treppen, Tore, Steigungen, sensible Naturschutzflächen und temporäre Sperrungen berücksichtigen. Keine Felsspitzen, Kletterstellen, Gegenstände oder abseits gelegenen Verstecke verwenden. Spielaufgaben bleiben digital und erfordern weder Sammeln noch Verändern der Natur.

Eine Begehung muss GPS-Empfang, Radius/Genauigkeit, sichere Aufenthaltsfläche ohne Wegblockade, Start-/Rückweg und reale Dauer bestätigen. Auch recherchierte Koordinaten sind vor dieser Begehung höchstens `desk_checked`; `field_checked` setzt diese tatsächliche Prüfung voraus. Aktuelle Betreiberanweisungen vor Ort haben Vorrang.

## Karten

Native Karten stammen aus Apple Maps/Google Maps und zeigen deren Attribution. Web: Leaflet mit öffentlichen OSM-Rasterkacheln und sichtbarer OSM-Attribution. Die OSM-Kacheln benötigen Internet und werden **nicht** für Offline-Verwendung heruntergeladen. Bei Netzwerkfehlern erklärt die App die Einschränkung; heruntergeladene Texte und GPS-Regeln bleiben unabhängig. Es wird keine Navigations- oder Routingsicherheit behauptet.
