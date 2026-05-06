// 此文件属于品牌层（跨剧通用主题上下文）
"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type AppThemeId = "brand" | "santi";

interface ThemeContextValue {
  theme: AppThemeId;
  setTheme: (id: AppThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
  initial?: AppThemeId;
}

export function ThemeProvider({ children, initial = "brand" }: ThemeProviderProps) {
  const [theme, setTheme] = useState<AppThemeId>(initial);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within <ThemeProvider>");
  }
  return ctx;
}
