import { describe, expect, jest, test } from "@jest/globals";
import { fireEventAsync, renderAsync } from "@testing-library/react-native";
import { router } from "expo-router";
import { PracticeEntry } from "@/components/practice-entry";
import { useAuth } from "@/features/auth/provider";
jest.mock("@/features/auth/provider", () => ({ useAuth: jest.fn() }));
jest.mock("@/lib/config", () => ({ config: { developmentMode: true } }));
jest.mock("expo-router", () => ({ router: { replace: jest.fn() } }));
jest.mock("@expo/vector-icons/Ionicons", () => "Icon");
describe("practice entry for signed-in users", () => {
  test("offers a working practice entry without a published live quest", async () => {
    const enterPractice = jest.fn();
    jest.mocked(useAuth).mockReturnValue({
      practice: false,
      enterPractice,
    } as unknown as ReturnType<typeof useAuth>);
    const ui = await renderAsync(<PracticeEntry />);
    await fireEventAsync.press(
      ui.getByRole("button", { name: "Quest im Übungsmodus öffnen" }),
    );
    expect(enterPractice).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith("/quest/details");
    await ui.unmountAsync();
  });
  test("does not duplicate the entry within an active practice session", async () => {
    jest
      .mocked(useAuth)
      .mockReturnValue({ practice: true } as unknown as ReturnType<
        typeof useAuth
      >);
    const ui = await renderAsync(<PracticeEntry />);
    expect(ui.queryByRole("button")).toBeNull();
    await ui.unmountAsync();
  });
});
