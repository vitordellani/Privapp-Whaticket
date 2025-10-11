import React, { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const ThemeModeContext = createContext({
  mode: "light",
  setMode: () => {},
  toggle: () => {},
});

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useLocalStorage("themeMode", "light");

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggle: () => setMode((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    [mode, setMode]
  );

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeModeContext);
export default ThemeModeContext;