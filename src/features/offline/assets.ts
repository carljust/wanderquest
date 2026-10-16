// Web has no persistent file system. Cache API holds downloaded media, never map tiles.
export async function downloadAsset(url: string, _id: string): Promise<string> {
  if (!url.startsWith("https://")) throw new Error("Ungültige Medienadresse.");
  if (typeof caches === "undefined")
    throw new Error(
      "Dieser Browser unterstützt keinen dauerhaften Medien-Cache.",
    );
  const response = await fetch(url);
  if (!response.ok)
    throw new Error("Eine Mediendatei konnte nicht geladen werden.");
  await (await caches.open("wyldo-quest-media-v1")).put(url, response);
  return url;
}
export async function resolveAsset(url: string) {
  if (typeof caches === "undefined") return url;
  const response = await (await caches.open("wyldo-quest-media-v1")).match(url);
  return response ? URL.createObjectURL(await response.blob()) : url;
}
