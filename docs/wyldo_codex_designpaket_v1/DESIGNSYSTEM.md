# Wyldo – Designsystem v1

## Haltung
Modernes *Adventure Game* für Familien. Magische Neugier, hochwertige Fantasy-Naturillustrationen, klare Gaming-UI, gut bedienbar im Freien. Nicht minimalistisch-nüchtern, aber auch keine überladenen Pergament-Textflächen. Visuelle Hierarchie vor Dekoration.

## Design Tokens (Richtwerte, im Code zentralisieren)
| Token | HEX | Verwendung |
|---|---|---|
| forest-950 | `#10291E` | immersive Hintergründe |
| forest-800 | `#173F32` | Navigation, Panels |
| leaf-600 | `#447D30` | primäre CTAs |
| leaf-400 | `#79AC45` | Erfolg/aktive Zustände |
| gold-500 | `#E5B94A` | XP, Siegel, Questmarkierung |
| parchment-100 | `#F8EFD9` | helle Dialogflächen |
| cream-50 | `#FFF9EF` | Text-/Kartenhintergründe |
| ink-900 | `#233029` | Text auf hell |
| orange-500 | `#DB6A24` | wichtige sekundäre Aktionen |

## Komponenten
- `AdventureHeader`: Branding, Level-/XP-Miniindikator, Aktionen.
- `QuestCard`: großes Artwork, Titel, Alter, Zeit, Entfernung, Schwierigkeit, Status, CTA.
- `BottomTabs`: exakt Entdecken / Karte / Rucksack / Profil.
- `QuestHud`: Questkapitel, Fortschritt, Pause, nächster Schritt.
- `NavigationModeSwitch`: Karte ↔ Richtung; beide Zustände funktional.
- `CompassDirection`: Zielpeilung und Luftlinienentfernung, Sensor-/Accuracy-Status.
- `WyldoDialog`: Figur, Dialog, Audio, Untertitel, Weiter-/Zurück-Optionen.
- `ChallengePanel`: Antwortauswahl, Hinweis, Validierung, Fehlerfeedback.
- `RewardReveal`: XP, Siegel und Belohnung mit Bewegung/Reduce-Motion-Fallback.
- `Backpack`: Level, XP, erledigte Quests, Abzeichen, Gegenstände.

## Regeln
- Touch-Ziele mindestens ca. 44–48 dp; klare Kontraste, gut lesbare Größen.
- Kernaktionen maximal eine pro Bereich; keine Buttons als reine Dekoration.
- Auf Karten/HUD nur sparsame Ornamente, GPS- und Sicherheitshinweise stets lesbar.
- Original-Fuchsdesign erhalten (orangefarbener Fuchs, grüner Schal, Rucksack, Kompass). Keine Annahme einer bereits funktionsfähigen Animation.
- Illustrative Mockups nicht direkt als UI-Hintergrund mit eingebrannter Schrift verwenden; echte Komponenten und zugängliche Texte bauen.
- Responsive auf kleinen Android-Geräten und iPhones.
