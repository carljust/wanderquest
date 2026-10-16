// Presentation-only practice preview. No regular XP ledger or reward is written.
// The real XP/level economy belongs to the phase after design approval.
export const XP_PER_LEVEL = 600;
export function levelProgress(total: number) {
  const xp = Number.isFinite(total) ? Math.max(0, Math.floor(total)) : 0;
  return {
    xp,
    level: 1 + Math.floor(xp / XP_PER_LEVEL),
    current: xp % XP_PER_LEVEL,
    next: XP_PER_LEVEL,
  };
}
export function practiceXp(
  completed: number,
  finished: boolean,
  stationXp = 100,
  completionXp = 500,
) {
  return Math.max(0, completed) * stationXp + (finished ? completionXp : 0);
}
