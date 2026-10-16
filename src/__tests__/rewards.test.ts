import { expect, test } from "@jest/globals";
import { levelProgress, practiceXp } from "@/domain/rewards";
test("level thresholds use earned XP without inventing a level", () => {
  expect(levelProgress(0)).toEqual({ xp: 0, level: 1, current: 0, next: 600 });
  expect(levelProgress(599).level).toBe(1);
  expect(levelProgress(600)).toEqual({
    xp: 600,
    level: 2,
    current: 0,
    next: 600,
  });
  expect(levelProgress(1300).level).toBe(3);
});
test("practice rewards are a separate computed preview", () => {
  expect(practiceXp(8, false)).toBe(800);
  expect(practiceXp(8, true)).toBe(1300);
  expect(practiceXp(2, false, 25, 200)).toBe(50);
});
