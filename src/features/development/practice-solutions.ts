import { normalizeAnswer } from "@/domain/engine";
export function checkPracticeAnswer(stationId: string, answer: string) {
  if (__DEV__) {
    const answers =
      require("../../../content/solutions.private.json") as Record<
        string,
        string[]
      >;
    return answers[stationId]?.includes(normalizeAnswer(answer)) ?? false;
  }
  throw new Error("Der Entwicklungsmodus ist in Release-Builds deaktiviert.");
}
