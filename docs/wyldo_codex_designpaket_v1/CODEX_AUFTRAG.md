# Umsetzungsauftrag für Codex

Arbeite im bestehenden Repository `carljust/wanderquest` (Expo/React Native/TypeScript). Dieses Paket unter `docs/design/wyldo-v1/` ist die verbindliche Produktspezifikation und visuelle Referenz. **Nicht blind neu aufsetzen.**

**Zuerst:** Bestand und Abweichungen zum Produktkonzept analysieren. Liste konkrete Dateien, Komponenten, Risiken und offenen Punkte. Dann einen Plan in kleinen überprüfbaren Pull Requests vorlegen. Keine produktiven Änderungen ohne technische Prüfung.

**Meilenstein A – Design:** UI-Tokens und Komponenten anlegen; Entdecken und Questdetails anhand `01/02` pixelnah, aber mit echten React-Native-Komponenten nachbauen; BottomTabs: Entdecken, Karte, Rucksack, Profil. Mockup-Text nicht als Bild einbetten. Freigabe-Screenshots erstellen.

**Meilenstein B – Navigation:** Startpunktnavigation auf geprüftem Routing, beide Modi implementieren; Sicherheitshinweise, GPS-Genauigkeit, Simulation und Pause. Das Bild `03` ist visuelle Referenz, kein echtes Kartenmaterial.

**Meilenstein C – Quest-Engine:** Zustandspersistenz, Events, Aufgaben, XP, vier Siegel, Abschluss und Rucksack; exemplarischer End-to-End-Spieltest mit simuliertem GPS. Acht Kapitel + Charakter Wyldo gemäß Produktkonzept.

**Meilenstein D – Backend:** Supabase Auth/Postgres/Storage/RLS; Migrations/Seed; öffentliche Questdaten von personenbezogenem Fortschritt trennen; sichere Challenge-Prüfung; Offline-Sync. Secrets nur serverseitig.

**Missionsdaten:** Vorhandenen JSON-Seed nur als Entwurf nutzen. Die gültige Acht-Kapitel-Fassung muss fachlich abgestimmt werden. Keine GPS-Koordinaten oder Wege als „real geprüft“ ausgeben, wenn sie nicht aus verlässlicher Quelle und Geländetest stammen. Kein direkter Luftlinien-Routenbau.

**Animation:** Fuchs-Mastergrafik referenzieren. Bis zu einem hochwertigen Rig nur gezielte hochwertige Standposen/kleine Übergänge verwenden, keine fehlerhaften PNG-Ausschneideanimationen. Questintro/Finale mit animationsfähigen Komponenten und Reduce-Motion-Fallback.

**Definition of done:** `ABNAHME.md` nachweisen, Tests/TS/Lint ausführen, mobile Testschritte dokumentieren, Fehlermodi behandeln, Screenshots vs. Mockup vergleichen und verbleibende Risiken aufführen. Keine Platzhalteraktionen als funktionsfähig bezeichnen.
