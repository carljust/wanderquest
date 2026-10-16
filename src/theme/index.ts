import { StyleSheet } from "react-native";

export const colors = {
  background: "#F7F6F0",
  surface: "#FFFFFF",
  forest: "#183D32",
  pine: "#2F6250",
  moss: "#DBE8D7",
  muted: "#68756B",
  line: "#E1E5DB",
  orange: "#CB542C",
  sand: "#F1E5D1",
  ink: "#1C3027",
  danger: "#A33327",
};

export const layout = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    padding: 24,
    gap: 24,
    paddingBottom: 36,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    color: colors.ink,
    letterSpacing: -1,
  },
  heading: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
    color: colors.ink,
    letterSpacing: -0.4,
  },
  body: { fontSize: 16, lineHeight: 24, color: colors.muted },
  eyebrow: {
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.8,
    fontWeight: "800",
    color: colors.pine,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
});
