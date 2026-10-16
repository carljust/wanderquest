# Offline und Wiederaufnahme

Der Download speichert den unveränderlichen Quest-Snapshot sowie alle tatsächlich referenzierten Medien mit erreichbarer URL. Native Dateien liegen im Dokumentverzeichnis; Webmedien im Cache API-Speicher, aufgelöste Blob-URLs werden nach Verwendung freigegeben. Fehlende Grafiken/Audios werden nicht als heruntergeladen ausgegeben. Der aktuelle Entwurf markiert Wyldo-Posen, Szenen und Siegel als `bundled`: Sie sind bereits Teil des installierten App-Bundles und benötigen keinen zusätzlichen HTTP-Download. Der Download speichert den Quest-Snapshot und vorhandene externe Medien; ein Erfolgshinweis unterscheidet fehlende weitere Dateien. Sprachaufnahmen sind nicht beigefügt.

Spielstand, Hinweiseinstellungen und Outbox stehen gemeinsam in einem AsyncStorage-Datensatz je Konto. Das verhindert eine Lücke zwischen lokalem Fortschritt und dem zugehörigen ausstehenden Befehl. Auth-Tokens liegen nativ generationenweise in SecureStore; Websessions verwenden den Browserspeicher. Ein Kontowechsel erzeugt einen neuen Anwendungskontext und übernimmt keine fremde Warteschlange. Logout löscht die Sitzung; der lokal kontogetrennte Fortschritt bleibt für spätere Anmeldung erhalten. Der Übungsmodus besitzt einen eigenen Schlüssel und keine regulären Belohnungen.

## Echtes Abenteuer

Ein Lauf muss zunächst online mit dem Server gestartet werden. Mit vorher gespeicherten freigegebenen Koordinaten arbeitet GPS anschließend ohne Kartenverbindung. Eine einmal freigeschaltete Station bleibt zugänglich. Freischaltung und Antworten können offline lokal vorgemerkt werden; Stationsfolge ist dann **vorläufig**, Siegel und Abschluss bleiben ausstehend bis zur Serverprüfung. Die App behauptet keine lokal geprüfte Lösung, die sie dafür offen im Client hinterlegen müsste. Neue geschützte Hinweisstufen werden erst bei Verbindung geladen; bereits angeforderte Hinweise bleiben im Snapshot lesbar.

Bei Netzrückkehr wird geordnet synchronisiert, nach jeder Serverantwort atomar gespeichert. Jede Aktion hat eine UUID. Ein erneuter Versand nach Verbindungsabbruch bekommt dieselbe Serverantwort. Falsche Antworten nehmen abhängige lokale Folgeaktionen zurück und führen zur erneut lösbaren Station. Abschluss und Belohnung erfolgen ausschließlich serverseitig.

GPS-Ereignisse verwenden die am Ereignis gemessene Genauigkeit/Position und den damaligen Zeitpunkt. Für spätere Übertragung gilt derzeit eine maximale Verzögerung von **sieben Tagen** sowie eine Plausibilitätsprüfung gegen Laufbeginn und Serverzeit. Das ersetzt keine Standortattestierung. Ein bereits bestätigtes Unlock bleibt bei schlechtem Folgesignal bestehen. Nicht behebbarer Konflikt: Im Profil lässt sich nach einer zweiten ausdrücklichen Betätigung der bestätigte Serverstand wiederherstellen; dabei werden unbestätigte Aktionen verworfen. Eine reine Netzwerkstörung soll zuerst erneut synchronisiert werden.

## Einschränkungen und Tests

Keine Offline-Karten: OSM-Kacheln werden nicht vorab geladen. Die Kartenansicht nennt diese Grenze. Es gibt keine Offline-Routenführung. Browser-Neuladen ohne Verbindung zum Webserver ist ohne installierte PWA nicht zugesagt; die primäre App ist die installierte Expo-/native Anwendung.

Unit-Tests prüfen Wiederherstellung, Kontotrennung, Reihenfolge, Netzfehler, Wiederholung, falsche Antworten und beschädigten Speicher. PostgreSQL prüft verspätete GPS-Übertragung und idempotente Operationen/Abzeichen. Ein kompletter echter Feldlauf mit heruntergeladenen finalen Bildern/Audios und Supabase-HTTP-Synchronisierung auf einem Smartphone ist noch nicht geprüft. Es fehlen die Voraussetzungen aus `verification.md`.
