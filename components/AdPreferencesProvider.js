import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useRouter } from "next/router";

const DEFAULT_MAX_SLOTS = Math.max(
  0,
  parseInt(process.env.NEXT_PUBLIC_ADSENSE_MAX_SLOTS || "1", 10) || 1
);

const AdPreferencesContext = createContext({
  registerSlot: () => true,
  autoAdsEnabled: false,
});

export function AdPreferencesProvider({ children }) {
  const router = useRouter();
  const slotCount = useRef(0);
  const maxSlots = DEFAULT_MAX_SLOTS;
  const autoAdsEnabled = process.env.NEXT_PUBLIC_ADSENSE_AUTO_ENABLED === "true";

  const registerSlot = useCallback(() => {
    if (slotCount.current >= maxSlots) {
      return false;
    }
    slotCount.current += 1;
    return true;
  }, [maxSlots]);

  useEffect(() => {
    slotCount.current = 0;
  }, [router.asPath]);

  const value = useMemo(
    () => ({
      registerSlot,
      autoAdsEnabled,
    }),
    [registerSlot, autoAdsEnabled]
  );

  return (
    <AdPreferencesContext.Provider value={value}>
      {children}
    </AdPreferencesContext.Provider>
  );
}

export function useAdPreferences() {
  return useContext(AdPreferencesContext);
}
