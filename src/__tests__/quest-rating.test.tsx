import { expect, jest, test } from "@jest/globals";
import { renderAsync } from "@testing-library/react-native";
import { QuestRating } from "@/components/quest-overview";

jest.mock("@expo/vector-icons/Ionicons", () => "Icon");

test("published average and count are displayed in German and read together", async () => {
  const ui = await renderAsync(
    <QuestRating summary={{ average: 4.25, count: 1234 }} />,
  );
  expect(ui.getByText("4,3 / 5")).toBeTruthy();
  expect(ui.getByText("1.234 Bewertungen")).toBeTruthy();
  expect(
    ui.getByLabelText("4,3 von 5 Sternen aus 1.234 Bewertungen"),
  ).toBeTruthy();
  expect(ui.queryAllByRole("button")).toHaveLength(0);
  await ui.unmountAsync();
});

test("zero reviews have no invented average or zero-star score", async () => {
  const ui = await renderAsync(
    <QuestRating summary={{ average: null, count: 0 }} />,
  );
  expect(ui.getByText("Noch keine Bewertungen")).toBeTruthy();
  expect(ui.getByText("0 Bewertungen")).toBeTruthy();
  expect(ui.getByText("— / 5")).toBeTruthy();
  expect(ui.queryByText("0,0 / 5")).toBeNull();
  await ui.unmountAsync();
});

test("missing or invalid aggregates cannot masquerade as real player reviews", async () => {
  const ui = await renderAsync(<QuestRating />);
  expect(ui.getByText("Bewertungen noch nicht verfügbar")).toBeTruthy();
  await ui.rerenderAsync(<QuestRating summary={{ average: 6, count: 10 }} />);
  expect(ui.getByText("Bewertungen noch nicht verfügbar")).toBeTruthy();
  expect(ui.queryByText("10 Bewertungen")).toBeNull();
  await ui.unmountAsync();
});
