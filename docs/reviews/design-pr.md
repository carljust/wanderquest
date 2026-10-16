# Wyldo · Phase 1 und 2: Hauptmasken zur Designfreigabe

Die drei Hauptmasken werden an die freigegebenen Referenzen angepasst: Entdecken folgt der jüngsten hellen Naturkomposition mit Original-Wyldo, überlappender Suche, Bildkarten und vier Tabs. Questdetails und Navigation behalten die Wald-/Goldgestaltung. Suche nach Titel/Region, Filter, Merkliste, Download, Fortsetzung und der vorhandene Acht-Stationen-Übungsablauf bleiben nutzbar.

Der aktuelle Auftrag ergänzt vier Architekturdokumente, zentrale Design-Tokens, eine gekennzeichnete XP-/Levelvorschau im Header und sichtbaren Altersstatus, Startbereich und Abschlussabzeichen in den Details. Karten-/Richtungswechsel ist eine wiederverwendbare Komponente. Browser und WebView teilen den Datenvertrag für freigegebene Ziele/Wege und gültiges GPS; ungeprüfte Geometrie wird nicht als Route angezeigt. Distanz bleibt auch im Kartenmodus sichtbar.

Validierung: TypeScript/ESLint, 55 Jest-Tests in 13 Suiten, 40 PGlite-Assertions und zehn Playwright-Fälle bestanden. Betroffenen Navigationsfall nach letzter Sichtkorrektur erneut geprüft. Web-/iOS-/Android-Hermesexports und Release-Fixture-Ausschluss bestanden. Visuell bei 360×800, 320×640 und 390×844 geprüft; XP-Überlagerung und Wortumbrüche korrigiert. Screenshots aus laufender Browseremulation, keine nativen Gerätetests.

[Architektur](https://github.com/carljust/wanderquest/tree/feat/wyldo-adventure-design-review/docs/architecture) · [Abnahmebericht](https://github.com/carljust/wanderquest/blob/feat/wyldo-adventure-design-review/docs/reviews/phase-1-2-acceptance.md) · [Screenshots](https://github.com/carljust/wanderquest/tree/feat/wyldo-adventure-design-review/docs/screenshots/phase-1-2).

Die genannten Dokumentpfade fehlen; die vorhandenen Nutzeroriginale unter `docs/PFLICHTENHEFT.md` und `docs/wyldo_codex_designpaket_v1/` wurden verwendet und erhalten. Es fehlen freigegebene Stationsorte/Track/Begehung, bestätigte Dauer/Länge/Quest-Altersempfehlung und Live-Supabase-/Google-Abnahme. Keine erfundenen Bewertungen, regulären XP oder zusätzlichen spielbaren Quests. Keine neue Migration, kein Creator-Modus. **Nach Phase 2 anhalten und die Designfreigabe abwarten.**
