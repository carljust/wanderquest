import { Directory, File, Paths } from "expo-file-system";
export async function downloadAsset(url: string, id: string) {
  if (!url.startsWith("https://") || !/^[a-zA-Z0-9_-]+$/.test(id))
    throw new Error("Ungültige Medienadresse.");
  const directory = new Directory(Paths.document, "wyldo-media");
  directory.create({ intermediates: true, idempotent: true });
  const file = new File(directory, id);
  await File.downloadFileAsync(url, file, { idempotent: true });
  return file.uri;
}
export async function resolveAsset(url: string) {
  return url;
}
