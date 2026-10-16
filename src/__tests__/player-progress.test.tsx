import { expect, test } from "@jest/globals";
import { renderAsync } from "@testing-library/react-native";
import { PlayerProgress } from "@/components/player-progress";

test("missing account XP is unavailable rather than an invented earned level", async () => {
  const ui = await renderAsync(<PlayerProgress light />);
  expect(ui.getByLabelText("XP und Level noch nicht verfügbar")).toBeTruthy();
  expect(ui.getByText("Noch nicht verfügbar")).toBeTruthy();
  expect(ui.queryByText(/Lv\. 1/)).toBeNull();
  await ui.unmountAsync();
});
test("practice XP is labelled as a preview and exposes accessible progress", async () => {
  const ui = await renderAsync(<PlayerProgress xp={700} practice light />);
  expect(ui.getByLabelText("Übungslevel 2, 100 von 600 XP")).toBeTruthy();
  expect(ui.getByText("100 / 600 XP · Vorschau")).toBeTruthy();
  expect(ui.getByRole("progressbar").props.accessibilityValue).toEqual({
    min: 0,
    max: 600,
    now: 100,
  });
  await ui.unmountAsync();
});
