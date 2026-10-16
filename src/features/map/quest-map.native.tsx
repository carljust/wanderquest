import { useEffect, useRef, useState } from "react";
import { Linking, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import type { Quest, Fix } from "@/domain/quest";
import { Button, Notice } from "@/components/ui";
import { mapHtml, mapPayload } from "./map-html";
import { layout } from "@/theme";
const source = { html: mapHtml() };
export function QuestMap({ quest, fix }: { quest: Quest | null; fix?: Fix }) {
  const ref = useRef<WebView>(null);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState("loading");
  const [externalError, setExternalError] = useState("");
  useEffect(() => {
    ref.current?.postMessage(JSON.stringify(mapPayload(quest, fix)));
  }, [quest, fix, status]);
  useEffect(() => {
    const timer = setTimeout(
      () =>
        setStatus((current) =>
          current === "loading" || current === "ready" ? "timeout" : current,
        ),
      12000,
    );
    return () => clearTimeout(timer);
  }, [attempt]);
  return (
    <View style={{ gap: 12 }}>
      <View
        style={{
          height: 380,
          borderRadius: 22,
          overflow: "hidden",
          backgroundColor: "#DBE8D7",
        }}
      >
        <WebView
          key={attempt}
          ref={ref}
          source={source}
          originWhitelist={["*"]}
          javaScriptEnabled
          scrollEnabled={false}
          sharedCookiesEnabled={false}
          thirdPartyCookiesEnabled={false}
          applicationNameForUserAgent="Wyldo/0.2.1 (+https://github.com/carljust/wanderquest)"
          onMessage={(event) => {
            try {
              const value = JSON.parse(event.nativeEvent.data);
              if (
                [
                  "ready",
                  "tiles-ready",
                  "tiles-error",
                  "configuration-error",
                ].includes(value.type)
              )
                setStatus(value.type);
            } catch {
              setStatus("configuration-error");
            }
          }}
          onError={() => setStatus("tiles-error")}
          onHttpError={() => setStatus("tiles-error")}
          onShouldStartLoadWithRequest={(request) => {
            if (request.url === "https://www.openstreetmap.org/copyright") {
              void Linking.openURL(request.url).catch(() =>
                setExternalError(
                  "Der Kartenhinweis konnte nicht geöffnet werden.",
                ),
              );
              return false;
            }
            return (
              request.url === "about:blank" ||
              request.url.startsWith("data:text/html")
            );
          }}
        />
      </View>
      {(status === "loading" || status === "ready") && (
        <Text style={layout.body}>Karte wird geladen …</Text>
      )}
      {["timeout", "tiles-error", "configuration-error"].includes(status) && (
        <Notice warning>
          Die Grundkarte konnte nicht vollständig geladen werden. Prüfe die
          Internetverbindung und versuche es erneut. Gespeicherte Questtexte und
          GPS bleiben verfügbar.
        </Notice>
      )}
      <Button
        label="Karte neu laden"
        secondary
        icon="refresh-outline"
        onPress={() => {
          setStatus("loading");
          setAttempt((value) => value + 1);
        }}
      />
      <Button
        label="Gebiet in externer Karte öffnen"
        secondary
        icon="open-outline"
        onPress={() =>
          void Linking.openURL(
            "https://www.openstreetmap.org/#map=15/51.869/8.917",
          ).catch(() =>
            setExternalError("Die externe Karte konnte nicht geöffnet werden."),
          )
        }
      />
      {Boolean(externalError) && <Notice warning>{externalError}</Notice>}
    </View>
  );
}
