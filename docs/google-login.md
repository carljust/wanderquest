# Mit Google anmelden

Der Login nutzt Supabase OAuth mit PKCE. Ein Google-Konto legt beim ersten Anmelden einen Supabase-Benutzer an; das vorhandene Profil-Trigger erstellt dessen Profil. E-Mail/Passwort bleibt eine zusätzliche Möglichkeit. Es werden keine Gmail-Nachrichten oder Gmail-Berechtigungen angefordert.

## Supabase und Google einrichten

1. Den öffentlichen Publishable-/Anon-Key in `.env.local` als `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` hinterlegen. Die Projekt-URL steht bereits in `.env.example`. Expo anschließend neu starten. Ein Service-Role-Schlüssel gehört niemals in die App.
2. In der [Google Cloud Console](https://console.cloud.google.com/apis/credentials) den OAuth-Zustimmungsbildschirm und einen OAuth-Client vom Typ **Webanwendung** für Supabase anlegen. Bei einem Google-Projekt im Teststatus die vorgesehenen Google-Konten als Testnutzer eintragen.
3. Als autorisierte **Weiterleitungs-URI beim Google-Client** exakt die im Supabase-Dashboard angezeigte Callback-URL verwenden. Für dieses Projekt lautet sie `https://rxkvdixavsrakbtmnsao.supabase.co/auth/v1/callback`.
4. Supabase → Authentication → Sign In / Providers → Google aktivieren. Google Client-ID und Client-Secret ausschließlich dort eintragen. Diese beiden Werte sind keine App-Umgebungsvariablen und gehören nicht ins Repository.
5. Supabase → Authentication → URL Configuration: `wyldo://auth/callback` sowie die tatsächliche HTTPS-Adresse der Browser-App mit `/auth/callback` als Rücksprung erlauben. Die Site URL auf die beabsichtigte Browser-App setzen. Für Entwicklung nur die konkret verwendeten Origins zulassen.
6. Beide SQL-Migrationen und `supabase/seed.sql` aus der README anwenden, falls das Projekt noch nicht eingerichtet ist.

## Smartphone: eigener Development Build

**Google OAuth wird hier nicht in Expo Go angeboten.** Expo dokumentiert für OAuth/OIDC mit einem stabilen eigenen Rücksprungschema einen Development Build. Die App zeigt dafür eine Erklärung. Quest, Bilder, OSM-Karte und der Übungsmodus lassen sich weiterhin in Expo Go testen.

Das Repository enthält `eas.json`, `expo-dev-client` sowie die Kennung `com.carljust.wyldo` für Android und iOS. Beispiel für einen späteren eigenen Android-Testbuild:

```bash
npx eas-cli@latest login
npx eas-cli@latest build --profile development --platform android
# Nach Installation dieses Builds auf dem Smartphone:
npm run start:dev
```

Ein Expo-Konto und eine eigene Build-Konfiguration/Signierung sind erforderlich. EAS kann abhängig von Kontingent und Tarif Kosten verursachen; hier wurde kein Build oder kostenpflichtiger Dienst gestartet. iOS-Gerätebuilds benötigen passende Apple-Signierung. Ein lokaler Build ist mit eingerichteter Android-/Xcode-Werkzeugkette ebenfalls möglich.

Im Browser `npm run web` verwenden. Codespaces benötigen die tatsächliche weitergeleitete Browser-Origin in der Supabase-Allowlist; eine andere Origin kann den PKCE-Rücksprung nicht übernehmen. Die Anmeldung im selben Browser und Tab beginnen und abschließen.

## Was geprüft ist

Unit-Tests prüfen Expo-Go-Erklärung, deaktivierten Provider, native Browser-Rückgabe, Abbruch, Web-Weiterleitung, Ablehnung fremder Rücksprungadressen und einmaligen Codeaustausch bei gleichzeitigem Router-/Browser-Callback. Browser und Auth-API sind dabei gemockt. Die App prüft die öffentliche Supabase-Anmeldekonfiguration vor dem Browserwechsel und zeigt einen deaktivierten Anbieter verständlich an.

**Ein echter Google-Login wurde nicht ausgeführt:** In dieser Umgebung fehlt weiterhin der öffentliche Supabase-Key; Google-Provider und administrative Projektkonfiguration sind nicht zugänglich. Noch auf Gerät prüfen: erfolgreicher Erstlogin, erneute Anmeldung, Browserabbruch, Logout, Rückkehr aus dem Hintergrund und Neustart mit bestehender Sitzung.

Quellen: [Expo Authentication](https://docs.expo.dev/develop/authentication/), [Supabase Google Login](https://supabase.com/docs/guides/auth/social-login/auth-google), [Supabase Native Deep Linking](https://supabase.com/docs/guides/auth/native-mobile-deep-linking). Die passenden SDK-57-Typdefinitionen wurden zusätzlich lokal geprüft.
