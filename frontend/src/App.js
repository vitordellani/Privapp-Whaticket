import React, { useState, useEffect, useMemo } from "react";
import Routes from "./routes";
import "react-toastify/dist/ReactToastify.css";

import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ptBR } from "@material-ui/core/locale";
import { ThemeModeProvider, useThemeMode } from "./context/ThemeMode/ThemeModeContext";

const ThemedApp = () => {
  const [locale, setLocale] = useState();
  const { mode } = useThemeMode();

  const theme = useMemo(() =>
    createTheme(
      {
        typography: {
          fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
        },

        scrollbarStyles: {
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.3)",
            backgroundColor: mode === "dark" ? "#424242" : "#e8e8e8",
          },
        },
        palette: {
          type: mode,
          mode: mode,
          primary: { main: "#2576d2" },
          secondary: { main: "#25D366" },
          background: {
            default: mode === "dark" ? "#121212" : "#fafafa",
            paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
          },
          text: {
            primary: mode === "dark" ? "#e0e0e0" : "#212121",
            secondary: mode === "dark" ? "#bdbdbd" : "#424242",
          },
        },
      },
      locale
    ), [mode, locale]
  );

  useEffect(() => {
    const i18nlocale = localStorage.getItem("i18nextLng");
    if (!i18nlocale) return;
    const browserLocale = i18nlocale.substring(0, 2) + i18nlocale.substring(3, 5);
    if (browserLocale === "ptBR") {
      setLocale(ptBR);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes />
    </ThemeProvider>
  );
};

const App = () => (
  <ThemeModeProvider>
    <ThemedApp />
  </ThemeModeProvider>
);

export default App;
