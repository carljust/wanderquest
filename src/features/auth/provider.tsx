import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { AppState, Platform } from "react-native";
import * as Linking from "expo-linking";
import { friendlyError, requireBackend, supabase } from "@/lib/supabase";
import { config } from "@/lib/config";

type Auth = {
  session: Session | null;
  loading: boolean;
  practice: boolean;
  error: string;
  enterPractice: () => void;
  logout: () => Promise<void>;
};
const Context = createContext<Auth | null>(null);
export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [practice, setPractice] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    void Promise.all([
      supabase
        ? supabase.auth.getSession()
        : Promise.resolve({ data: { session: null }, error: null }),
      AsyncStorage.getItem("wyldo.practice-enabled"),
    ])
      .then(([result, savedPractice]) => {
        if (alive) {
          setSession(result.data.session);
          setPractice(config.developmentMode && savedPractice === "true");
          setError(result.error ? friendlyError(result.error) : "");
          setLoading(false);
        }
      })
      .catch((e: unknown) => {
        if (alive) {
          setError(friendlyError(e));
          setLoading(false);
        }
      });
    if (!supabase)
      return () => {
        alive = false;
      };
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      if (alive) {
        setSession(next);
        setLoading(false);
      }
    });
    const sub = AppState.addEventListener("change", (state) => {
      if (Platform.OS !== "web") {
        if (state === "active") supabase?.auth.startAutoRefresh();
        else supabase?.auth.stopAutoRefresh();
      }
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
      sub.remove();
    };
  }, []);
  return (
    <Context.Provider
      value={{
        session,
        loading,
        practice,
        error,
        enterPractice: () => {
          if (config.developmentMode) {
            void AsyncStorage.setItem("wyldo.practice-enabled", "true");
            setPractice(true);
          }
        },
        logout: async () => {
          if (session) {
            const { error } = await requireBackend().auth.signOut();
            if (error) throw error;
          }
          await AsyncStorage.removeItem("wyldo.practice-enabled");
          setPractice(false);
          setSession(null);
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useAuth() {
  const value = useContext(Context);
  if (!value) throw new Error("AuthProvider fehlt");
  return value;
}
export const authRedirect = () => Linking.createURL("auth/callback");
