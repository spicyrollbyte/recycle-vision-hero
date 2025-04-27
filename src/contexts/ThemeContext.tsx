import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    return savedTheme || "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const isLandingPage = window.location.pathname === '/' || window.location.pathname === '/landing';
    // Clear theme and landing-page classes
    root.classList.remove("light", "dark", "landing-page");
    if (isLandingPage) {
      // Force light theme on landing page
      root.classList.add("light", "landing-page");
    } else {
      // Apply selected theme on other pages
      root.classList.add(theme);
    }
    // Save theme selection
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
