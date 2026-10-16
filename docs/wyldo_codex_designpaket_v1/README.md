# Wyldo – Codex-Designpaket v1.0

**Ziel:** Bestehendes Expo/React-Native-Projekt `carljust/wanderquest` gezielt zu einem echten, für Familien spielbaren Outdoor-Adventure weiterentwickeln.

## Inhalt
- `mockups/01–03`: große, bereits freigegebene Designreferenzen für Entdecken, Quest-Details und Richtungsnavigation.
- `mockups/04–15`: einzeln zugeschnittene *niedrig aufgelöste* Storyboard-Referenzen für die Questinteraktion. Sie sind keine produktionsreifen Layout-Dateien.
- `assets/reference/`: Originalfuchs und Charakter-/Quest-Storyboard. **Nicht automatisch als fertige UI- oder Rig-Assets verwenden.**
- `quest/`: vorhandener Missions-Seed als **Entwurf**, nicht als geprüfte GPS-Route oder freigegebene vollständige Geschichte.
- `PRODUKTKONZEPT.md`, `SCREENS.md`, `DESIGNSYSTEM.md`, `ABNAHME.md`, `CODEX_AUFTRAG.md`.

## Grenzen
Die Mockups sind KI-generierte Bildreferenzen. Enthaltene Karten, Routen, Entfernungen, XP-Werte und Ortsillustrationen sind nicht automatisch sachlich oder geografisch korrekt. Der alte Seed kann von der festgelegten Acht-Kapitel-Geschichte abweichen; fachliche Spezifikation hat Vorrang. Für eine echte Quest müssen freigegebene Wegdaten, verifizierte GPS-Trigger und Geländetests ergänzt werden. Grafiken sind visuelle Referenzen und müssen für die App als saubere Einzelassets neu exportiert/erstellt und hinsichtlich Nutzungsrechten geprüft werden.

## Codex Workflow
1. Paket ins Repo z. B. `docs/design/wyldo-v1/` kopieren.
2. `CODEX_AUFTRAG.md` an Codex übergeben.
3. Bestehenden Code prüfen und Änderungsliste erstellen.
4. Designsystem + drei Screens implementieren, Screenshotvergleich und Freigabe.
5. Quest-State-Machine und Navigation implementieren und offline simulieren.
6. Reale Route separat prüfen und vor Ort testen, erst danach GPS-Quest veröffentlichen.
