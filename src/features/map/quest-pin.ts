import { tokens } from "../../theme/tokens";

// Leaflet's reusable SVG pin. Only a validated numeric label enters the markup;
// content titles always use textContent, never HTML interpolation.
export function questPinSvg(order: number, selected = false) {
  const label =
    Number.isSafeInteger(order) && order > 0 && order < 100
      ? String(order)
      : "?";
  const fill = selected ? tokens.adventure.gold : tokens.adventure.forestPanel;
  const ink = selected ? tokens.adventure.ink : tokens.adventure.cream;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="52" viewBox="0 0 44 52" aria-hidden="true"><path d="M22 50 8 31A19 19 0 1 1 36 31Z" fill="${fill}" stroke="${tokens.adventure.goldEdge}" stroke-width="2"/><circle cx="22" cy="21" r="14" fill="none" stroke="${tokens.adventure.cream}" stroke-opacity=".6"/><text x="22" y="27" text-anchor="middle" font-size="18" font-weight="700" font-family="sans-serif" fill="${ink}">${label}</text></svg>`;
}
