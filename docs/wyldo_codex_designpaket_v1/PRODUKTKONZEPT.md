# Wyldo – verbindliches Produktkonzept

**Zielgruppe:** Familien mit Kindern, ungefähr ab 7 Jahren, gemeinsam mit Erwachsenen. Ziel: Kinder durch ein spannendes Adventure-Game in die Natur locken. Kein neutrales Wanderportal.

**Produkt:** GPS-basierte, erzählerische Outdoor-Quests mit Leveln, XP, Abzeichen und sammelbaren Gegenständen. Fuchs **Wyldo** ist die zentrale Begleitfigur; er wird bei Intro, Dialogen, Ereignissen, Rätseln und Finale gezeigt, **nicht permanent während der Navigation**.

**Hauptnavigation:** Entdecken, Karte, Rucksack, Profil. Nach Login stets Entdecken.

**Core-Loop:** Quest in Entdecken oder Karte finden → Details → Zum Startpunkt navigieren (Karte oder Peilpfeil) → GPS-Ankunft → Wyldo begrüßt → Queststart → kurzes Intro → Wyldo erklärt Geschichte → Navigation zum nächsten Ziel → GPS-Ankunft → Wyldo + Aufgabe → Antwort, Feedback, XP, eventuelles Siegel → nächstes Ziel → Finale, Animation, Zusammenfassung, XP, Abzeichen → Rucksack. Quest pausierbar und fortsetzbar.

**Navigation:** Kartenmodus zeigt reale Wegführung entlang freigegebener Wege, aktuelle Position, Ziel und Entfernung. Richtungsmodus zeigt Peilpfeil, Luftlinienentfernung und deutlichen Hinweis, auf Wegen zu bleiben. Zwischen Modi frei umschalten. Offline- und GPS-Ungenauigkeit robust behandeln. Keine versteckte Hintergrundortung.

**Erste Quest:** *Der verlorene Schatz der Externsteine*: Fuchs Wyldo findet Schatzkarte, acht Story-Kapitel, vier Steinsiegel, u. a. Runa der Steinkauz, Abschluss mit virtuellem Schatz und Abzeichen. Keine physischen Schätze oder gefährlichen Kletter-/Suchstellen. Exakte Dialoge, Antworten, GPS-Punkte und Wegfolge sind vor Produktivfreigabe zu redigieren, mit offiziellen Wegdaten abzugleichen und vor Ort zu testen.

**Datenhaltung:** Supabase/PostgreSQL zentral mit Auth, RLS, Storage; Fortschritte offline lokal puffern und idempotent synchronisieren. Sichere Rätselvalidierung; Lösungen nicht ungeschützt öffentlich bereitstellen.

**Nicht verwechseln:** Quest-Suche auf der allgemeinen Karte vs. Missionsnavigation im Spiel. Vor Questbeginn ist der einzige aktive Button *Zum Startpunkt navigieren*, nicht *Quest sofort abschließen*.
