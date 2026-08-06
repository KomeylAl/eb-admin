"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AccountingNavContextValue = {
  isMobileOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;
};

const AccountingNavContext = createContext<AccountingNavContextValue | null>(
  null
);

export function AccountingNavProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const openMobileNav = useCallback(() => setIsMobileOpen(true), []);
  const closeMobileNav = useCallback(() => setIsMobileOpen(false), []);
  const toggleMobileNav = useCallback(
    () => setIsMobileOpen((prev) => !prev),
    []
  );

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isMobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileOpen]);

  const value = useMemo(
    () => ({
      isMobileOpen,
      openMobileNav,
      closeMobileNav,
      toggleMobileNav,
    }),
    [isMobileOpen, openMobileNav, closeMobileNav, toggleMobileNav]
  );

  return (
    <AccountingNavContext.Provider value={value}>
      {children}
    </AccountingNavContext.Provider>
  );
}

export function useAccountingNav() {
  const ctx = useContext(AccountingNavContext);
  if (!ctx) {
    throw new Error("useAccountingNav must be used within AccountingNavProvider");
  }
  return ctx;
}
