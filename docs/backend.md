# Backend und Veröffentlichungen

Das vorhandene Supabase-Projekt wurde nicht verändert: öffentlicher Client-Key, administrative Datenbankverbindung und aktive Netzwerkfreigabe fehlen. Migrationen wurden lokal in einer echten PostgreSQL-Engine (PGlite/WASM) ausgeführt. Supabase Auth, PostgREST, GoTrue und Storage-HTTP wurden dabei nicht nachgebildet; die SQL-Tests setzen `auth.uid()` über einen synthetischen JWT-Subject.

## Datenmodell

`quests` → `quest_versions` → geordnete `stations`, `puzzles`, `dialogues`, `quest_assets`. Das JSON-Dokument ist der unveränderliche öffentliche Lesesnapshot einer Version. Die normalisierten Tabellen unterstützen gezielte Auswertung und Storage-Berechtigungen. Redaktionelle Quelle: `content/externsteine.v1.json`; `scripts/generate-seed.mjs` erstellt daraus SQL. Private Lösungen und Antwort verratende Erfolgs-/Hinweistexte landen in `private.solutions` und `private.station_feedback`, niemals im öffentlichen Snapshot.

`profiles`, `quest_runs`, `station_progress`, `earned_seals`, `badge_awards` speichern persönliche Daten. Die Moduskennung eines Laufs ist serverseitig unveränderbar. Badge-Eindeutigkeit gilt pro Nutzer, Quest und Abzeichen über Versionswechsel hinweg. Aktive Läufe sind an ihre Version gebunden. Beim Fortsetzen wird die gespeicherte Version bevorzugt geladen. Frühere Versionen mit laufenden Abenteuern müssen veröffentlicht und abrufbar bleiben. Ohne lokalen Stand zeigt die Oberfläche die jüngste veröffentlichte Version; eine Mehrquest-/Versionsbibliothek ist noch nicht enthalten.

## Zugriff und Befehle

- Öffentliche Spielerabfragen sehen ausschließlich veröffentlichte Inhalte; kein Schreibrecht auf die Redaktionstabellen.
- Persönliche Tabellen sind nur für den eigenen `auth.uid()` lesbar. Profiländerungen sind auf `display_name` beschränkt.
- Fortschritt ist ausschließlich durch `start_quest`, `quest_command` und die geprüfte Logik veränderbar. Es gibt keine direkten Spieler-Updates auf Status-, Siegel- oder Belohnungstabellen.
- `quest_command` überprüft Nutzer, Modus, Stationsreihenfolge, Freischaltung, GPS und Antwort. `finish` zählt acht bestätigte Stationsdatensätze und vier verschiedene Siegel. Serveraktionen sind pro Nutzer serialisiert; Operations-UUIDs speichern Antworten für Wiederholungen. Die Unique-Constraint verhindert doppelte Abzeichen auch bei wiederholten Abschlussaufrufen.
- `get_quest_state` liefert den eigenen Stand mit bereits freigegebenen Erfolgsdialogen und angeforderten Hinweisstufen. Eine neue Hinweisstufe wird nur über die explizite Hint-Aktion sichtbar.
- RPCs verwenden einen leeren `search_path` und qualifizierte Tabellennamen. Funktionen und private Schemas haben explizite Rechte.

GPS-Daten stammen vom Gerät. Die Prüfung von Radius, Genauigkeit und Reihenfolge ist **keine fälschungssichere Standortattestierung**. Ein manipulierter Client kann Koordinaten behaupten. Es gibt keine Behauptung eines vollständigen Anti-Cheat-Systems. Reguläre Auszeichnungen sind serverseitig konsistent und Testläufe ausgeschlossen; für stärkeren Manipulationsschutz wäre ein gesondertes Konzept nötig.

## Bilder, Audio und Rig

Privater Storage-Bucket `quest-assets`. Spieler dürfen nur Objekte lesen, deren Pfad über `quest_assets` einer veröffentlichten Version referenziert wird. Uploads/Änderungen erfolgen durch Administration, nicht die App. Der Client erzeugt signierte Leselinks mit 24 Stunden Laufzeit und lädt vorhandene Dateien für Offline-Nutzung dauerhaft lokal herunter. Nach Ablauf der Links Quest online aktualisieren; lokale Downloads bleiben nutzbar. Fehlende Medien werden ausdrücklich ausgewiesen. Rive wird nicht eingebunden; der Figurenvertrag liegt im Code und in `companion.md`.

## Erstveröffentlichung

Zuerst Originaltexte und Design abgleichen, freigegebene Medien einpflegen, Quelle/Datum/OSM-Objekt oder amtlichen Geodatensatz für jede Koordinate dokumentieren, echte Weggeometrie übernehmen und die Route vor Ort begehen. Danach Quelldokument mit `approval: approved`, `fieldReady: true`, vollständiger tatsächlicher Route und acht `field_checked`-Stationen als **neue** geprüfte Version ausarbeiten. Radiuswerte vor Ort testen. Auch Streckenlänge, Dauer und Startbeschreibung messen/prüfen.

Der aktuelle Generator setzt absichtlich `draft`, `pending_source_review`, `field_ready=false` und keine Koordinaten. Er ist für den vorhandenen Entwurf bestimmt und **kein Freigabewerkzeug**. Die spätere freigegebene Version braucht eine eigene Datenmigration, die normalisierte Stationskoordinaten und das öffentliche Dokument konsistent einfügt, Lösungen/Feedback privat ablegt und erst zum Schluss veröffentlicht. Ein bloßes Umschalten von `status` wäre keine fachliche Freigabe. Die App und Startfunktion blockieren unvollständig freigegebene Daten.

Vor Produktivbetrieb echte Registrierung, Bestätigung, Login, Recovery-Link und Logout auf beiden Plattformen prüfen; SMTP-/Rate-Limits sowie Datenschutzkontakt und Kontolöschprozess einrichten. Diese administrativen Schritte sind noch offen.
