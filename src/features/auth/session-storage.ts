import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Commit a new generation only after every chunk was written. JWT sessions can
// exceed a single SecureStore item. No tokens go into native AsyncStorage.
export const sessionStorage =
  Platform.OS === "web"
    ? AsyncStorage
    : {
        async getItem(key: string) {
          const meta = await SecureStore.getItemAsync(key + ".meta");
          if (!meta) return null;
          const { generation, count } = JSON.parse(meta) as {
            generation: string;
            count: number;
          };
          const parts = await Promise.all(
            Array.from({ length: count }, (_, i) =>
              SecureStore.getItemAsync(`${key}.${generation}.${i}`),
            ),
          );
          return parts.some((part) => part === null) ? null : parts.join("");
        },
        async setItem(key: string, value: string) {
          const previous = await SecureStore.getItemAsync(key + ".meta");
          const generation =
            Date.now().toString(36) + Math.random().toString(36).slice(2);
          const count = Math.ceil(value.length / 1500);
          for (let i = 0; i < count; i++)
            await SecureStore.setItemAsync(
              `${key}.${generation}.${i}`,
              value.slice(i * 1500, (i + 1) * 1500),
            );
          await SecureStore.setItemAsync(
            key + ".meta",
            JSON.stringify({ generation, count }),
          );
          if (previous) {
            const old = JSON.parse(previous) as {
              generation: string;
              count: number;
            };
            await Promise.all(
              Array.from({ length: old.count }, (_, i) =>
                SecureStore.deleteItemAsync(`${key}.${old.generation}.${i}`),
              ),
            );
          }
        },
        async removeItem(key: string) {
          const meta = await SecureStore.getItemAsync(key + ".meta");
          await SecureStore.deleteItemAsync(key + ".meta");
          if (meta) {
            const old = JSON.parse(meta) as {
              generation: string;
              count: number;
            };
            await Promise.all(
              Array.from({ length: old.count }, (_, i) =>
                SecureStore.deleteItemAsync(`${key}.${old.generation}.${i}`),
              ),
            );
          }
        },
      };
