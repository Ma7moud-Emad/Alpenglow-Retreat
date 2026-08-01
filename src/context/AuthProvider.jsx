import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "../lib/supabase";
import { getMyProfile } from "../services/staff";
import { AuthContext } from "./contexts";

/**
 * Session state, sourced from Supabase itself.
 *
 * The previous implementation decided whether someone was signed in by testing
 * for the presence of a localStorage key, which stayed "true" long after the
 * token expired and could be set by hand. This subscribes to the real auth
 * state and pairs the session with the staff profile that RLS keys off.
 */
export default function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setIsRestoring(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession ?? null);
      setIsRestoring(false);

      // Never let one account see another's cached rows.
      if (event === "SIGNED_OUT" || event === "SIGNED_IN") {
        queryClient.clear();
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const userId = session?.user?.id ?? null;

  const { data: profile, isPending: isProfilePending } = useQuery({
    queryKey: ["staff", "me", userId],
    queryFn: getMyProfile,
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile: profile ?? null,
      role: profile?.role ?? null,
      isAdmin: profile?.role === "admin",
      isAuthenticated: Boolean(session),
      // Routing must not run until both the session and the role are known,
      // otherwise admin-only screens flash a permission error on refresh.
      isLoading: isRestoring || (Boolean(userId) && isProfilePending),
    }),
    [session, profile, isRestoring, userId, isProfilePending]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
