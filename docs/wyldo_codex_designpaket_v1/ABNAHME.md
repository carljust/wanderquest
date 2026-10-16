# Abnahme und Tests

1. Nach Login öffnet sich **Entdecken**, mit Suche und Standort-/Regionsfallback.
2. Questpin auf der Hauptkarte öffnet Kurzinformation und Detailansicht.
3. Questdetails zeigen echte Daten, „Zum Startpunkt navigieren“ startet **noch nicht** die Questgeschichte.
4. Navigation in beiden Modi: echte Wegkarte + Peilpfeil, Umschaltung ohne Fortschrittsverlust.
5. GPS-Simulation erlaubt vollständigen Durchlauf ohne Reise nach Horn-Bad Meinberg. GPS-Ankunft benutzt konfigurierbare Radien und Genauigkeitsprüfung; reale GPS-Tests werden gesondert durchgeführt.
6. An Startpunkt erscheint Wyldo; Intro erst nach Bestätigung. Danach Questnavigation.
7. Jede Station: GPS-Trigger → Dialog/Rätsel → Feedback → neue Station, ohne doppelte Events.
8. Vier Steinsiegel und XP werden korrekt genau einmal vergeben. Nach App-Neustart und Pause kommt derselbe Spielstand zurück.
9. Abschluss zeigt Animation/Fallback, Zusammenfassung und Badge; Rucksack zeigt alle Rewards.
10. Mit Netzwerkverlust bleiben heruntergeladene Inhalte nutzbar; Synchronisierung wiederholt keine Rewards.
11. Navigationsfehler, denied permissions, inaccurate GPS, fehlende Assets, Offline, Lade-/Fehlerzustände getestet.
12. Layout gegen drei große Referenzscreens vergleichen (visueller Screenshotvergleich), auf Android und iOS-Größen prüfen.
13. Questdaten aus zentraler Datenbank laden, korrekt durch RLS gesichert; keine Rätsellösungen offen abrufbar.
14. **Go-live-Blocker:** reale Wegfolge, GPS-Triggerpunkte, Bildrechte, lokale Sicherheits-/Naturschutzvorgaben und Vor-Ort-Test bestätigt.
